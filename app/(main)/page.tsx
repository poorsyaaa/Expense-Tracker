import { Battery, Calendar, DollarSign, PieChart } from "lucide-react";
import DashboardCard from "./_components/dashboard/card/dashboard-card";
import RecentExpensesTable from "./_components/dashboard/recent-expenses-table";
import UpcomingExpenses from "./_components/dashboard/upcoming-expenses";
import SavingsOverviewCard from "./_components/dashboard/card/savings-overview-card";
import ExpenseTrends from "./_components/dashboard/chart/expense-trend";
import BudgetUtilization from "./_components/dashboard/chart/budget-utilization";
import IncomeVsExpenses from "./_components/dashboard/chart/income-vs-expense";
import SpendingByCategoryComponent from "./_components/dashboard/chart/spending-by-category";

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
          subtitle="Updated just now"
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
      {/* overview*/}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <SavingsOverviewCard
          data={{
            income: 5000,
            expenses: 3245.67,
            savings: 1754.33,
          }}
        />
      </div>
      {/* chart*/}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2 xl:grid-cols-4">
        <SpendingByCategoryComponent
          data={[
            { category: "Food", amount: 1200, fill: "#F87171" },
            { category: "Housing", amount: 2500, fill: "#4CAF50" },
            { category: "Transportation", amount: 800, fill: "#2196F3" },
            { category: "Entertainment", amount: 600, fill: "#FFC107" },
            { category: "Healthcare", amount: 400, fill: "#9C27B0" },
            { category: "Utilities", amount: 300, fill: "#FF5722" },
            { category: "Others", amount: 500, fill: "#607D8B" },
          ]}
        />
        <IncomeVsExpenses
          data={[
            { month: "January", income: 1235, expenses: 3000 },
            { month: "February", income: 50600, expenses: 3200 },
            { month: "March", income: 6123, expenses: 3100 },
            { month: "April", income: 975, expenses: 1235 },
            { month: "May", income: 5000, expenses: 66123 },
            { month: "June", income: 5000, expenses: 3100 },
            { month: "July", income: 5000, expenses: 12356 },
            { month: "August", income: 3354, expenses: 6123 },
            { month: "September", income: 2315, expenses: 3200 },
            { month: "October", income: 5000, expenses: 6123 },
            { month: "November", income: 23123, expenses: 1232 },
            { month: "December", income: 1324, expenses: 123 },
          ]}
          trend={{
            type: "down",
            value: 3.8,
          }}
        />
        <BudgetUtilization
          budget={5000}
          utilized={3245.67}
          trend={{
            type: "down",
            value: 3.8,
          }}
        />
        <ExpenseTrends
          data={[
            { month: "January", amount: 10 },
            { month: "February", amount: 2700 },
            { month: "March", amount: 2300 },
            { month: "April", amount: 2400 },
            { month: "May", amount: 2600 },
            { month: "June", amount: 2200 },
            { month: "July", amount: 2100 },
            { month: "August", amount: 2500 },
            { month: "September", amount: 2600 },
            { month: "October", amount: 2300 },
            { month: "November", amount: 2200 },
            { month: "December", amount: 2800 },
          ]}
          trend={{
            type: "down",
            value: 3.8,
          }}
        />
      </div>
      {/* table*/}
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
