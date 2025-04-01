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

type Expense = {
  id: string;
  title: string;
  amount: number;
  category: "MARKETING" | "OFFICE" | "MAINTENANCE" | "TRAVEL" | "OTHER";
  property: string | null;
  date: string;
  status: "PENDING" | "APPROVED" | "REIMBURSED";
  receipt: string | null;
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch('/api/expenses');
      if (!response.ok) throw new Error('Failed to fetch expenses');
      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      setError('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleCreateExpense = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    try {
      const receiptUrl = selectedFile ? URL.createObjectURL(selectedFile) : null;

      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.get('title'),
          amount: formData.get('amount'),
          category: formData.get('category'),
          property: formData.get('property') || null,
          date: formData.get('date'),
          status: 'PENDING',
          receipt: receiptUrl,
          userId: 'temp-user-id',
        }),
      });

      if (!response.ok) throw new Error('Failed to create expense');
      
      await fetchExpenses();
      router.refresh();
    } catch (err) {
      setError('Failed to create expense');
    }
  };

  const handleUpdateExpense = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingExpense) return;

    const formData = new FormData(event.currentTarget);
    
    try {
      const receiptUrl = selectedFile ? URL.createObjectURL(selectedFile) : editingExpense.receipt;

      const response = await fetch(`/api/expenses/${editingExpense.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.get('title'),
          amount: formData.get('amount'),
          category: formData.get('category'),
          property: formData.get('property') || null,
          date: formData.get('date'),
          status: formData.get('status'),
          receipt: receiptUrl,
        }),
      });

      if (!response.ok) throw new Error('Failed to update expense');
      
      await fetchExpenses();
      setEditingExpense(null);
      router.refresh();
    } catch (err) {
      setError('Failed to update expense');
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete expense');
      
      await fetchExpenses();
      router.refresh();
    } catch (err) {
      setError('Failed to delete expense');
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Expenses</h1>
          <p className="text-muted-foreground">
            Track and manage your business expenses
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Expense</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
              <DialogDescription>
                Record a new business expense
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateExpense} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter expense title"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  placeholder="Enter amount"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="MARKETING">Marketing</option>
                  <option value="OFFICE">Office</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="TRAVEL">Travel</option>
                  <option value="OTHER">Other</option>
                </select>
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
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="receipt">Receipt (Optional)</Label>
                <Input
                  id="receipt"
                  name="receipt"
                  type="file"
                  onChange={handleFileChange}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Add Expense</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Total Expenses</CardTitle>
          <CardDescription>Current period</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">${totalExpenses.toFixed(2)}</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {expenses.map((expense) => (
          <Card key={expense.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{expense.title}</span>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    expense.category === "MARKETING"
                      ? "bg-blue-100 text-blue-700"
                      : expense.category === "OFFICE"
                      ? "bg-purple-100 text-purple-700"
                      : expense.category === "MAINTENANCE"
                      ? "bg-orange-100 text-orange-700"
                      : expense.category === "TRAVEL"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {expense.category}
                </span>
              </CardTitle>
              <CardDescription>
                {new Date(expense.date).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Amount:</span>{" "}
                  ${expense.amount.toFixed(2)}
                </p>
                {expense.property && (
                  <p className="text-sm">
                    <span className="font-medium">Property:</span>{" "}
                    {expense.property}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      expense.status === "REIMBURSED"
                        ? "bg-green-100 text-green-700"
                        : expense.status === "APPROVED"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {expense.status}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                {expense.receipt && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(expense.receipt!, '_blank')}
                  >
                    View Receipt
                  </Button>
                )}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingExpense(expense)}
                    >
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Expense</DialogTitle>
                      <DialogDescription>
                        Update expense details
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateExpense} className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="edit-title">Title</Label>
                        <Input
                          id="edit-title"
                          name="title"
                          defaultValue={expense.title}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-amount">Amount</Label>
                        <Input
                          id="edit-amount"
                          name="amount"
                          type="number"
                          step="0.01"
                          defaultValue={expense.amount}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-category">Category</Label>
                        <select
                          id="edit-category"
                          name="category"
                          defaultValue={expense.category}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          required
                        >
                          <option value="MARKETING">Marketing</option>
                          <option value="OFFICE">Office</option>
                          <option value="MAINTENANCE">Maintenance</option>
                          <option value="TRAVEL">Travel</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-property">Property (Optional)</Label>
                        <Input
                          id="edit-property"
                          name="property"
                          defaultValue={expense.property || ''}
                          placeholder="Enter property address"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-date">Date</Label>
                        <Input
                          id="edit-date"
                          name="date"
                          type="date"
                          defaultValue={expense.date.split('T')[0]}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-status">Status</Label>
                        <select
                          id="edit-status"
                          name="status"
                          defaultValue={expense.status}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          required
                        >
                          <option value="PENDING">Pending</option>
                          <option value="APPROVED">Approved</option>
                          <option value="REIMBURSED">Reimbursed</option>
                        </select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-receipt">Receipt (Optional)</Label>
                        <Input
                          id="edit-receipt"
                          name="receipt"
                          type="file"
                          onChange={handleFileChange}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setEditingExpense(null)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Update Expense</Button>
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
                        This action cannot be undone. This will permanently delete the expense.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteExpense(expense.id)}
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