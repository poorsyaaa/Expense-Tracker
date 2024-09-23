import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ICONS_MAP } from "@/components/ui/icon-picker";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, getRelativeDueDate } from "@/lib/utils";

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
  const currentDate = new Date();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Expenses</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        <ScrollArea className="max-h-80">
          {expenses.length > 0 ? (
            expenses.map((expense) => {
              const IconComponent = ICONS_MAP[expense.icon];
              const relativeDueDate = getRelativeDueDate(expense.dueDate);
              const dueDate = new Date(expense.dueDate);

              const daysUntilDue =
                (dueDate.getTime() - currentDate.getTime()) /
                (1000 * 3600 * 24);
              let textColor = "text-muted-foreground";
              if (daysUntilDue < 0) {
                textColor = "text-red-500";
              } else if (daysUntilDue < 7) {
                textColor = "text-yellow-500";
              }

              return (
                <div key={expense.id} className="mb-4 flex items-center">
                  {IconComponent ? (
                    <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
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
                    <p className="max-w-[300px] break-words text-sm font-medium leading-none">
                      {expense.name}
                    </p>
                    <p
                      className={cn("text-sm text-muted-foreground", textColor)}
                    >
                      Due: {relativeDueDate}
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
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default UpcomingExpenses;
