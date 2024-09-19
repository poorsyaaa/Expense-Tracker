import { Battery, Calendar, DollarSign, PieChart } from "lucide-react";
import DashboardCard from "./_components/dashboard/dashboard-card";
import RecentExpensesTable from "./_components/dashboard/recent-expenses-table";
import UpcomingExpenses from "./_components/dashboard/upcoming-expenses";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <DashboardCard
          title="Total expenses"
          amount={3245.67}
          currency="PHP"
          subtitle="+10% from last month"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Monthly Budget"
          amount={1500}
          currency="PHP"
          subtitle="Set for this month"
          icon={<PieChart className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Remaining Budget"
          amount={500}
          currency="PHP"
          subtitle="35% of budget remaining"
          icon={<Battery className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Expenses This Month"
          amount={2000}
          currency="PHP"
          subtitle="2 expenses this month"
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <RecentExpensesTable
          expenses={[
            {
              id: "1",
              description: "Groceries",
              amount: 150.0,
              category: "Food",
              paymentMethod: "Credit Card",
              date: "2023-10-01",
            },
            {
              id: "2",
              description: "Rent",
              amount: 1200.0,
              category: "Housing",
              paymentMethod: "Bank Transfer",
              date: "2023-10-01",
            },
            {
              id: "3",
              description: "Utilities",
              amount: 100.0,
              category: "Bills",
              paymentMethod: "Direct Debit",
              date: "2023-10-02",
            },
            {
              id: "4",
              description: "Dining Out",
              amount: 75.0,
              category: "Food",
              paymentMethod: "Debit Card",
              date: "2023-10-03",
            },
            {
              id: "5",
              description: "Gym Membership",
              amount: 50.0,
              category: "Health",
              paymentMethod: "Credit Card",
              date: "2023-10-04",
            },
          ]}
          currency="PHP"
        />
        <UpcomingExpenses
          expenses={[
            {
              id: "1",
              name: "Electricity Bill",
              dueDate: "2023-10-15",
              amount: 120.0,
              icon: "/avatars/electricity.png",
            },
            {
              id: "2",
              name: "Water Bill",
              dueDate: "2023-10-18",
              amount: 45.0,
              icon: "/avatars/water.png",
            },
            {
              id: "3",
              name: "Internet Bill",
              dueDate: "2023-10-20",
              amount: 60.0,
              icon: "/avatars/internet.png",
            },
            {
              id: "4",
              name: "Phone Bill",
              dueDate: "2023-10-22",
              amount: 35.0,
              icon: "/avatars/phone.png",
            },
            {
              id: "5",
              name: "Insurance",
              dueDate: "2023-10-25",
              amount: 200.0,
              icon: "/avatars/insurance.png",
            },
          ]}
          currency="PHP"
        />
      </div>
    </div>
  );
}
