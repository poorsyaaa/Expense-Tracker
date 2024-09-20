import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface SavingsOverview {
  income: number;
  expenses: number;
  savings: number;
}

interface SavingsOverviewProps {
  data: SavingsOverview;
}

const SavingsOverviewCard: React.FC<SavingsOverviewProps> = ({ data }) => {
  const savingsPercentage = ((data.savings / data.income) * 100).toFixed(2);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Savings Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-medium">Income:</span>
            <span className="font-semibold">
              ${data.income.toLocaleString()}
            </span>
          </div>
          <div className="mb-2 flex items-center justify-between">
            <span className="font-medium">Expenses:</span>
            <span className="font-semibold">
              ${data.expenses.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Savings:</span>
            <span className="font-semibold text-green-600">
              ${data.savings.toLocaleString()} ({savingsPercentage}%)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SavingsOverviewCard;
