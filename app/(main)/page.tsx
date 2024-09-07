import {
  ArrowUpRight,
  Battery,
  Calendar,
  DollarSign,
  PieChart,
} from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,245.67</div>
            <p className="text-xs text-muted-foreground">
              +10% from last month
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Budget
            </CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$5,000.00</div>
            <p className="text-xs text-muted-foreground">Set for this month</p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Remaining Budget
            </CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,754.33</div>
            <p className="text-xs text-muted-foreground">
              35% of budget remaining
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Expenses This Month
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,245.67</div>
            <p className="text-xs text-muted-foreground">Updated just now</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
          <CardHeader className="flex flex-row items-center">
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
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Groceries</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      Supermarket
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-column">Food</TableCell>
                  <TableCell className="hidden xl:table-column">
                    Credit Card
                  </TableCell>
                  <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                    2023-10-01
                  </TableCell>
                  <TableCell className="text-right">$150.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Rent</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      Apartment
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-column">
                    Housing
                  </TableCell>
                  <TableCell className="hidden xl:table-column">
                    Bank Transfer
                  </TableCell>
                  <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                    2023-10-01
                  </TableCell>
                  <TableCell className="text-right">$1,200.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Utilities</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      Electricity Bill
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-column">
                    Bills
                  </TableCell>
                  <TableCell className="hidden xl:table-column">
                    Direct Debit
                  </TableCell>
                  <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                    2023-10-02
                  </TableCell>
                  <TableCell className="text-right">$100.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Dining Out</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      Restaurant
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-column">Food</TableCell>
                  <TableCell className="hidden xl:table-column">
                    Debit Card
                  </TableCell>
                  <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                    2023-10-03
                  </TableCell>
                  <TableCell className="text-right">$75.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Gym Membership</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      Fitness Center
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-column">
                    Health
                  </TableCell>
                  <TableCell className="hidden xl:table-column">
                    Credit Card
                  </TableCell>
                  <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                    2023-10-04
                  </TableCell>
                  <TableCell className="text-right">$50.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-5">
          <CardHeader>
            <CardTitle>Upcoming Bills</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8">
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage
                  src="/avatars/electricity.png"
                  alt="Electricity Bill"
                />
                <AvatarFallback>EB</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  Electricity Bill
                </p>
                <p className="text-sm text-muted-foreground">Due: 2023-10-15</p>
              </div>
              <div className="ml-auto font-medium">-$120.00</div>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/avatars/water.png" alt="Water Bill" />
                <AvatarFallback>WB</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">Water Bill</p>
                <p className="text-sm text-muted-foreground">Due: 2023-10-18</p>
              </div>
              <div className="ml-auto font-medium">-$45.00</div>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/avatars/internet.png" alt="Internet Bill" />
                <AvatarFallback>IB</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  Internet Bill
                </p>
                <p className="text-sm text-muted-foreground">Due: 2023-10-20</p>
              </div>
              <div className="ml-auto font-medium">-$60.00</div>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/avatars/phone.png" alt="Phone Bill" />
                <AvatarFallback>PB</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">Phone Bill</p>
                <p className="text-sm text-muted-foreground">Due: 2023-10-22</p>
              </div>
              <div className="ml-auto font-medium">-$35.00</div>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/avatars/insurance.png" alt="Insurance" />
                <AvatarFallback>IN</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">Insurance</p>
                <p className="text-sm text-muted-foreground">Due: 2023-10-25</p>
              </div>
              <div className="ml-auto font-medium">-$200.00</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
