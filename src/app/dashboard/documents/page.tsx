'use client'

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

type Document = {
  id: string;
  title: string;
  client: string;
  property: string | null;
  type: "CONTRACT" | "INVOICE" | "REPORT" | "OTHER";
  status: "PENDING" | "SIGNED" | "EXPIRED";
  date: string;
  size: number;
  url: string;
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents');
      if (!response.ok) throw new Error('Failed to fetch documents');
      const data = await response.json();
      setDocuments(data);
    } catch (err) {
      setError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleCreateDocument = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    try {
      // In a real app, we would upload the file to a storage service first
      // and get back a URL. For now, we'll use a placeholder URL
      const documentUrl = selectedFile ? URL.createObjectURL(selectedFile) : null;

      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.get('title'),
          client: formData.get('client'),
          property: formData.get('property') || null,
          type: formData.get('type'),
          status: 'PENDING',
          size: selectedFile?.size || 0,
          url: documentUrl,
          userId: 'temp-user-id',
        }),
      });

      if (!response.ok) throw new Error('Failed to create document');
      
      await fetchDocuments();
      router.refresh();
    } catch (err) {
      setError('Failed to create document');
    }
  };

  const handleUpdateDocument = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingDocument) return;

    const formData = new FormData(event.currentTarget);
    
    try {
      const documentUrl = selectedFile ? URL.createObjectURL(selectedFile) : editingDocument.url;

      const response = await fetch(`/api/documents/${editingDocument.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.get('title'),
          client: formData.get('client'),
          property: formData.get('property') || null,
          type: formData.get('type'),
          status: formData.get('status'),
          size: selectedFile?.size || editingDocument.size,
          url: documentUrl,
          date: formData.get('date'),
        }),
      });

      if (!response.ok) throw new Error('Failed to update document');
      
      await fetchDocuments();
      setEditingDocument(null);
      router.refresh();
    } catch (err) {
      setError('Failed to update document');
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete document');
      
      await fetchDocuments();
      router.refresh();
    } catch (err) {
      setError('Failed to delete document');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-muted-foreground">
            Manage your real estate documents
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Upload Document</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Document</DialogTitle>
              <DialogDescription>
                Upload a new document to your database
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateDocument} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter document title"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="client">Client</Label>
                <Input
                  id="client"
                  name="client"
                  placeholder="Enter client name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="property">Property (Optional)</Label>
                <Input
                  id="property"
                  name="property"
                  placeholder="Enter property address"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Document Type</Label>
                <select
                  id="type"
                  name="type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="CONTRACT">Contract</option>
                  <option value="INVOICE">Invoice</option>
                  <option value="REPORT">Report</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="document">Document</Label>
                <Input
                  id="document"
                  name="document"
                  type="file"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Upload Document</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {documents.map((document) => (
          <Card key={document.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{document.title}</span>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    document.type === "CONTRACT"
                      ? "bg-blue-100 text-blue-700"
                      : document.type === "INVOICE"
                      ? "bg-green-100 text-green-700"
                      : document.type === "REPORT"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {document.type}
                </span>
              </CardTitle>
              <CardDescription>
                {new Date(document.date).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Client:</span> {document.client}
                </p>
                {document.property && (
                  <p className="text-sm">
                    <span className="font-medium">Property:</span>{" "}
                    {document.property}
                  </p>
                )}
                <p className="text-sm">
                  <span className="font-medium">Size:</span>{" "}
                  {formatFileSize(document.size)}
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      document.status === "SIGNED"
                        ? "bg-green-100 text-green-700"
                        : document.status === "EXPIRED"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {document.status}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(document.url, '_blank')}
                >
                  View Document
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingDocument(document)}
                    >
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Document</DialogTitle>
                      <DialogDescription>
                        Update document details
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateDocument} className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="edit-title">Title</Label>
                        <Input
                          id="edit-title"
                          name="title"
                          defaultValue={document.title}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-client">Client</Label>
                        <Input
                          id="edit-client"
                          name="client"
                          defaultValue={document.client}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-property">Property (Optional)</Label>
                        <Input
                          id="edit-property"
                          name="property"
                          defaultValue={document.property || ''}
                          placeholder="Enter property address"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-type">Document Type</Label>
                        <select
                          id="edit-type"
                          name="type"
                          defaultValue={document.type}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          required
                        >
                          <option value="CONTRACT">Contract</option>
                          <option value="INVOICE">Invoice</option>
                          <option value="REPORT">Report</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-status">Status</Label>
                        <select
                          id="edit-status"
                          name="status"
                          defaultValue={document.status}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          required
                        >
                          <option value="PENDING">Pending</option>
                          <option value="SIGNED">Signed</option>
                          <option value="EXPIRED">Expired</option>
                        </select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-date">Date</Label>
                        <Input
                          id="edit-date"
                          name="date"
                          type="date"
                          defaultValue={document.date.split('T')[0]}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-document">New Document (Optional)</Label>
                        <Input
                          id="edit-document"
                          name="document"
                          type="file"
                          onChange={handleFileChange}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setEditingDocument(null)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Update Document</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the document.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteDocument(document.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 