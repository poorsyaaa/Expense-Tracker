import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ICONS_MAP } from "@/components/ui/icon-picker";

interface Expense {
  id: string;
  name: string;
  dueDate: string;
  amount: number;
  icon: string;
}

interface UpcomingExpensesProps {
  expenses: Expense[];
  currency: string;
}

const UpcomingExpenses: React.FC<UpcomingExpensesProps> = ({
  expenses,
  currency,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Expenses</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        {expenses.length > 0 ? (
          expenses.map((expense) => {
            const IconComponent = ICONS_MAP[expense.icon];

            return (
              <div key={expense.id} className="flex items-center gap-4">
                {IconComponent ? (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                    <IconComponent />
                  </div>
                ) : (
                  <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarFallback>
                      {expense.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    {expense.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Due: {new Date(expense.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  {expense.amount.toFixed(2)} {currency}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-muted-foreground">
            No upcoming expenses.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingExpenses;
