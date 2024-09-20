import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  amount: number;
  currency: string;
  subtitle: string;
  icon: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  amount,
  currency,
  subtitle,
  icon,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {amount.toLocaleString()} {currency}
        </div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
