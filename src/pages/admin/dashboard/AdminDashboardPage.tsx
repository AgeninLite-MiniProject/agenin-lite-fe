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
import { useAdminDashboardQuery } from "@/hooks/useAdminDashboard";

export default function AdminDashboardPage() {
  const { data, isLoading, isError } = useAdminDashboardQuery();

  if (isLoading) {
    return (
      <div className="p-10 max-w-6xl flex justify-center items-center h-64">
        <p className="text-slate-500 font-medium animate-pulse">Loading dashboard data...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-10 max-w-6xl flex justify-center items-center h-64">
        <p className="text-red-500 font-medium">Failed to load dashboard data. Please check your connection.</p>
      </div>
    );
  }


  const activeAgentPercentage = data.total_users > 0
    ? Math.round((data.active_agents / data.total_users) * 100)
    : 0;

  const summaryCards = [
    {
      title: "TOTAL AGENTS",
      value: data.total_users.toLocaleString(),
      description: "Registered agents",
      descriptionColor: "text-blue-600",
    },
    {
      title: "ACTIVE AGENTS",
      value: data.active_agents.toLocaleString(),
      description: `${activeAgentPercentage}% of total agents`,
      descriptionColor: "text-slate-500",
    },
    {
      title: "TOTAL TRANSACTIONS",
      value: data.total_transactions.toLocaleString(),
      description: "Completed globally",
      descriptionColor: "text-slate-500",
    },
    {
      title: "TOTAL PRODUCTS",
      value: data.total_products.toLocaleString(),
      description: "Active catalog",
      descriptionColor: "text-slate-500",
    },
  ];

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
            {data.recent_activities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                  No recent activities found
                </TableCell>
              </TableRow>
            ) : (
              data.recent_activities.map((activity, idx) => {
                const date = new Date(activity.time);
                const formattedTime = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

                let badgeColor = "border-slate-500 text-slate-600";
                if (activity.status === "COMPLETED") badgeColor = "border-green-500 text-green-600";
                else if (activity.status === "PENDING") badgeColor = "border-amber-500 text-amber-600";
                else if (activity.status === "FAILED" || activity.status === "CANCELLED") badgeColor = "border-red-500 text-red-600";

                return (
                  <TableRow key={idx} className="border-slate-100 hover:bg-slate-50/50">
                    <TableCell className="font-medium text-slate-600 py-4">{formattedTime}</TableCell>
                    <TableCell className="text-slate-800 py-4">{activity.user}</TableCell>
                    <TableCell className="text-slate-600 py-4">{activity.action}</TableCell>
                    <TableCell className="text-right pr-6 py-4">
                      <Badge
                        variant="outline"
                        className={badgeColor}
                      >
                        {activity.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
