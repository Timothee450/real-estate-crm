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

type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: "BUYER" | "SELLER" | "TENANT" | "LANDLORD";
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  properties: string;
  lastContact: string;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients');
      if (!response.ok) throw new Error('Failed to fetch clients');
      const data = await response.json();
      setClients(data);
    } catch (err) {
      setError('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          type: formData.get('type'),
          status: 'ACTIVE',
          properties: formData.get('properties') || '',
          lastContact: new Date().toISOString(),
          userId: 'temp-user-id',
        }),
      });

      if (!response.ok) throw new Error('Failed to create client');
      
      await fetchClients();
      router.refresh();
    } catch (err) {
      setError('Failed to create client');
    }
  };

  const handleUpdateClient = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingClient) return;

    const formData = new FormData(event.currentTarget);
    
    try {
      const response = await fetch(`/api/clients/${editingClient.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          type: formData.get('type'),
          status: formData.get('status'),
          properties: formData.get('properties') || '',
          lastContact: formData.get('lastContact'),
        }),
      });

      if (!response.ok) throw new Error('Failed to update client');
      
      await fetchClients();
      setEditingClient(null);
      router.refresh();
    } catch (err) {
      setError('Failed to update client');
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      const response = await fetch(`/api/clients/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete client');
      
      await fetchClients();
      router.refresh();
    } catch (err) {
      setError('Failed to delete client');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-muted-foreground">
            Manage your real estate clients
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Client</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>
                Add a new client to your database
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateClient} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter client name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Client Type</Label>
                <select
                  id="type"
                  name="type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="BUYER">Buyer</option>
                  <option value="SELLER">Seller</option>
                  <option value="TENANT">Tenant</option>
                  <option value="LANDLORD">Landlord</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="properties">Properties (Optional)</Label>
                <Input
                  id="properties"
                  name="properties"
                  placeholder="Enter property addresses (comma-separated)"
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Add Client</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <Card key={client.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{client.name}</span>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    client.type === "BUYER"
                      ? "bg-blue-100 text-blue-700"
                      : client.type === "SELLER"
                      ? "bg-green-100 text-green-700"
                      : client.type === "TENANT"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {client.type}
                </span>
              </CardTitle>
              <CardDescription>
                Last Contact: {new Date(client.lastContact).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Email:</span> {client.email}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Phone:</span> {client.phone}
                </p>
                {client.properties && (
                  <p className="text-sm">
                    <span className="font-medium">Properties:</span>{" "}
                    {client.properties}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      client.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : client.status === "INACTIVE"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {client.status}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingClient(client)}
                    >
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Client</DialogTitle>
                      <DialogDescription>
                        Update client details
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateClient} className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="edit-name">Name</Label>
                        <Input
                          id="edit-name"
                          name="name"
                          defaultValue={client.name}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-email">Email</Label>
                        <Input
                          id="edit-email"
                          name="email"
                          type="email"
                          defaultValue={client.email}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-phone">Phone</Label>
                        <Input
                          id="edit-phone"
                          name="phone"
                          type="tel"
                          defaultValue={client.phone}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-type">Client Type</Label>
                        <select
                          id="edit-type"
                          name="type"
                          defaultValue={client.type}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          required
                        >
                          <option value="BUYER">Buyer</option>
                          <option value="SELLER">Seller</option>
                          <option value="TENANT">Tenant</option>
                          <option value="LANDLORD">Landlord</option>
                        </select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-properties">Properties (Optional)</Label>
                        <Input
                          id="edit-properties"
                          name="properties"
                          defaultValue={client.properties}
                          placeholder="Enter property addresses (comma-separated)"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-status">Status</Label>
                        <select
                          id="edit-status"
                          name="status"
                          defaultValue={client.status}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          required
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="INACTIVE">Inactive</option>
                          <option value="PENDING">Pending</option>
                        </select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-lastContact">Last Contact</Label>
                        <Input
                          id="edit-lastContact"
                          name="lastContact"
                          type="date"
                          defaultValue={client.lastContact.split('T')[0]}
                          required
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setEditingClient(null)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Update Client</Button>
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
                        This action cannot be undone. This will permanently delete the client.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteClient(client.id)}
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