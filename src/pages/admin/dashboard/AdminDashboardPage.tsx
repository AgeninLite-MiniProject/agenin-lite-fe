import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";

const summaryCards = [
  {
    title: "TOTAL USERS",
    value: "1,254",
    description: "+12 new today",
    descriptionColor: "text-blue-600",
  },
  {
    title: "ACTIVE AGENTS",
    value: "840",
    description: "67% of total users",
    descriptionColor: "text-slate-500",
  },
  {
    title: "TOTAL TRANSACTIONS",
    value: "8,432",
    description: "Completed this month",
    descriptionColor: "text-slate-500",
  },
  {
    title: "TOTAL PRODUCTS",
    value: "45",
    description: "Active catalog",
    descriptionColor: "text-slate-500",
  },
];

const recentActivities = [
  {
    time: "10:30 AM",
    user: "Budi Santoso (Agent)",
    action: "Completed a transaction",
    status: "SUCCESS",
  },
  {
    time: "09:45 AM",
    user: "System Admin",
    action: "Added new product 'Paket Data 10GB'",
    status: "SUCCESS",
  },
  {
    time: "09:15 AM",
    user: "Siti Aminah (Agent)",
    action: "Updated profile information",
    status: "SUCCESS",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="p-10 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 mt-2 text-lg">
          Welcome back, Admin. Here is what's happening in the system today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {summaryCards.map((card, index) => (
          <Card key={index} className="rounded-3xl border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <p className="text-xs font-bold text-slate-500 tracking-wider mb-4 uppercase">
                {card.title}
              </p>
              <h3 className="text-4xl font-semibold text-slate-900 mb-2">
                {card.value}
              </h3>
              <p className={`text-sm font-medium ${card.descriptionColor}`}>
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
          <Link
            to="/admin/audit"
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            View All
          </Link>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-slate-100">
              <TableHead className="text-xs font-bold text-slate-500 tracking-wider w-[150px]">TIME</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 tracking-wider">USER</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 tracking-wider">ACTION</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 tracking-wider text-right pr-6">STATUS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentActivities.map((activity, idx) => (
              <TableRow key={idx} className="border-slate-100 hover:bg-slate-50/50">
                <TableCell className="font-medium text-slate-600 py-4">{activity.time}</TableCell>
                <TableCell className="text-slate-800 py-4">{activity.user}</TableCell>
                <TableCell className="text-slate-600 py-4">{activity.action}</TableCell>
                <TableCell className="text-right pr-6 py-4">
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700 hover:bg-green-100 border-transparent shadow-none"
                  >
                    {activity.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
