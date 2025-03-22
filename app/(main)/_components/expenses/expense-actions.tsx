import { useState } from "react";
import {
  MoreHorizontal,
  Pencil,
  Trash,
  Calendar,
  CreditCard,
  Tag,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ExpenseForm from "./expense-form"; // Updated import path
import {
  useUpdateExpense,
  useDeleteExpense,
} from "@/api/mutations/expenses-hook";
import { expenseSchema } from "@/lib/schema/expenses"; // Updated to match import in ExpenseForm
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ExpenseType, PaymentMethod } from "@prisma/client";
import { toast } from "sonner";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

// Type for expense object with correct tags structure
interface ExpenseActionsProps {
  expense: {
    id: string;
    description: string;
    amount: number;
    categoryId: string;
    startDate: string;
    dueDate?: string;
    paymentMethod: PaymentMethod;
    type: ExpenseType;
    isPaid: boolean;
    tags: string[] | { id: string; name: string }[]; // Updated to handle both formats
    expenseNote?: string;
    category: {
      id: string;
      name: string;
      icon: string;
    };
  };
  onSuccess?: () => void; // Optional callback for after successful operations
}

const ExpenseActions: React.FC<ExpenseActionsProps> = ({
  expense,
  onSuccess,
}) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const updateExpense = useUpdateExpense();
  const deleteExpense = useDeleteExpense();

  // Process tags to ensure they're in the right format for the form
  const processedTags = Array.isArray(expense.tags)
    ? typeof expense.tags[0] === "string"
      ? (expense.tags as string[])
      : (expense.tags as { id: string; name: string }[]).map((tag) => tag.name)
    : [];

  const handleEdit = async (data: typeof expenseSchema._type) => {
    try {
      await updateExpense.mutateAsync({
        expenseId: expense.id,
        data,
      });
      setShowEditDialog(false);
      toast.success("Expense updated", {
        description: "Your expense has been updated successfully.",
      });
      onSuccess?.();
    } catch (error) {
      console.error("Failed to update expense:", error);
      toast.error("Error", {
        description: "Failed to update expense. Please try again.",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteExpense.mutateAsync(expense.id);
      setShowDeleteDialog(false);
      toast.success("Expense deleted", {
        description: "Your expense has been deleted successfully.",
      });
      onSuccess?.();
    } catch (error) {
      console.error("Failed to delete expense:", error);
      toast.error("Error", {
        description: "Failed to delete expense. Please try again.",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            data-testid="expense-actions-trigger"
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setShowDetailsDialog(true)}>
            <FileText className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Expense Details</DialogTitle>
            <DialogDescription>
              Detailed information about this expense
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {expense.description}
                  </h3>
                  <div
                    className={`text-lg font-bold ${expense.isPaid ? "text-green-600" : "text-amber-600"}`}
                  >
                    {formatCurrency(expense.amount)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Category:</span>
                    <div className="flex items-center">
                      <span className="mr-1">{expense.category.icon}</span>
                      <span>{expense.category.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Status:</span>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        expense.isPaid
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {expense.isPaid ? "Paid" : "Unpaid"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Date:</span>
                    <span>{formatDate(expense.startDate)}</span>
                  </div>
                  {expense.dueDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Due:</span>
                      <span>{formatDate(expense.dueDate)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Payment:</span>
                    <span>{expense.paymentMethod.replace("_", " ")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Type:</span>
                    <span>{expense.type.replace("_", " ")}</span>
                  </div>
                </div>

                {processedTags.length > 0 && (
                  <div className="mt-4">
                    <h4 className="mb-1 text-sm font-medium text-muted-foreground">
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {processedTags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {expense.expenseNote && (
                  <div className="mt-4">
                    <h4 className="mb-1 text-sm font-medium text-muted-foreground">
                      Notes
                    </h4>
                    <p className="text-sm">{expense.expenseNote}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDetailsDialog(false);
                setShowEditDialog(true);
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Expense
            </Button>
            <Button onClick={() => setShowDetailsDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
            <DialogDescription>
              Make changes to your expense here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <ExpenseForm
            defaultValues={{
              description: expense.description,
              amount: expense.amount,
              categoryId: expense.categoryId,
              startDate: expense.startDate,
              dueDate: expense.dueDate || "",
              paymentMethod: expense.paymentMethod,
              type: expense.type,
              isPaid: expense.isPaid,
              tags: processedTags,
              expenseNote: expense.expenseNote || "",
            }}
            onSubmit={handleEdit}
            onCancel={() => setShowEditDialog(false)}
            isSubmitting={updateExpense.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              expense &quot;{expense.description}&quot; of{" "}
              {formatCurrency(expense.amount)}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={deleteExpense.isPending}
            >
              {deleteExpense.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ExpenseActions;
