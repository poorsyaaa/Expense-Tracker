import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ArrowUpRight } from "lucide-react";

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
  date: string;
}

interface RecentExpensesTableProps {
  expenses: Expense[];
  currency: string;
}

const RecentExpensesTable: React.FC<RecentExpensesTableProps> = ({
  expenses,
  currency,
}) => {
  return (
    <div className="xl:col-span-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="grid gap-2">
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>Your latest expenses.</CardDescription>
          </div>
          <Button asChild size="sm" className="ml-auto gap-1">
            <Link href="#">
              View All
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Expense</TableHead>
                <TableHead className="hidden xl:table-column">
                  Category
                </TableHead>
                <TableHead className="hidden xl:table-column">
                  Payment Method
                </TableHead>
                <TableHead className="hidden xl:table-column">Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>
                    <div className="font-medium">{expense.description}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {expense.category}
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-column">
                    {expense.category}
                  </TableCell>
                  <TableCell className="hidden xl:table-column">
                    {expense.paymentMethod}
                  </TableCell>
                  <TableCell className="hidden xl:table-column">
                    {new Date(expense.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {expense.amount.toFixed(2)} {currency}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentExpensesTable;
