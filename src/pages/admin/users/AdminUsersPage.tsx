import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const users = [
  {
    id: 10,
    name: "Budi Santoso",
    phone: "+628123456789",
    status: "ACTIVE",
    isDeleted: false,
  },
  {
    id: 11,
    name: "Andi Wijaya",
    phone: "+628987654321",
    status: "PASSIVE",
    isDeleted: false,
  },
  {
    id: 12,
    name: "Spammer 123",
    phone: "+628000000000",
    status: "PASSIVE",
    isDeleted: true,
  },
];

export default function AdminUsersPage() {
  return (
    <div className="p-10 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Management</h1>
        <p className="text-slate-500 mt-2 text-lg">
          Monitor registered agents and manage account suspensions.
        </p>
      </div>

      <div className="mb-6 max-w-md relative">
        <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
        <Input
          placeholder="Search by name or phone number..."
          className="pl-11 h-12 rounded-2xl border-slate-200 bg-white text-base shadow-sm focus-visible:ring-blue-500"
        />
      </div>

      <div className="rounded-3xl border border-slate-200 shadow-sm bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-slate-100">
              <TableHead className="text-xs font-bold text-slate-500 tracking-wider py-4 pl-6 w-[80px]">ID</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 tracking-wider">AGENT NAME</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 tracking-wider">PHONE NUMBER</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 tracking-wider">STATUS</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 tracking-wider">IS DELETED?</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 tracking-wider text-right pr-6">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="border-slate-100 hover:bg-slate-50/50">
                <TableCell className="font-medium text-slate-600 py-4 pl-6">{user.id}</TableCell>
                <TableCell className={`font-semibold py-4 ${user.isDeleted ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                  {user.name}
                </TableCell>
                <TableCell className={`py-4 ${user.isDeleted ? 'text-slate-400' : 'text-slate-600'}`}>{user.phone}</TableCell>
                <TableCell className="py-4">
                  <Badge
                    variant="secondary"
                    className={`shadow-none border-transparent font-semibold ${
                      user.status === "ACTIVE"
                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                        : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                    }`}
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-4">
                  <Badge
                    variant="secondary"
                    className={`shadow-none border-transparent font-semibold ${
                      user.isDeleted
                        ? "bg-red-100 text-red-700 hover:bg-red-100"
                        : "bg-indigo-50 text-indigo-700 hover:bg-indigo-50"
                    }`}
                  >
                    {user.isDeleted ? "TRUE" : "FALSE"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-6 py-4">
                  {!user.isDeleted ? (
                    <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 font-semibold rounded-full px-4">
                      Delete
                    </Button>
                  ) : (
                    <span className="text-sm text-slate-400 font-medium">No action</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-white">
          <p className="text-sm text-slate-500 font-medium">
            Showing 1 to 3 of 3 entries
          </p>
          <div className="flex items-center space-x-1">
            <Button variant="outline" size="sm" className="h-9 px-4 rounded-lg border-slate-200 text-slate-500 font-medium hover:bg-slate-50" disabled>
              Prev
            </Button>
            <Button variant="default" size="sm" className="h-9 w-9 p-0 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium">
              1
            </Button>
            <Button variant="outline" size="sm" className="h-9 px-4 rounded-lg border-slate-200 text-slate-500 font-medium hover:bg-slate-50" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
