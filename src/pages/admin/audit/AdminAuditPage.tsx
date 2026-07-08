import { Search, Calendar, Shield, ChevronDown, Filter } from "lucide-react";
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

const audits = [
  {
    id: 1,
    timestamp: "2026-10-25 10:15:00",
    actor: "+628123456789",
    isAdmin: false,
    actionType: "LOGIN_SUCCESS",
    actionColor: "bg-blue-600 hover:bg-blue-600 text-white border-transparent",
    payload: '{"ip":"192.168.1.1"}',
  },
  {
    id: 2,
    timestamp: "2026-10-25 10:20:00",
    actor: "+628123456789",
    isAdmin: false,
    actionType: "INVITATION_SENT",
    actionColor: "bg-slate-500 hover:bg-slate-500 text-white border-transparent",
    payload: '{"to":"+628987..."}',
  },
  {
    id: 3,
    timestamp: "2026-10-25 11:00:00",
    actor: "ADMIN",
    isAdmin: true,
    actionType: "PRODUCT_SAVED",
    actionColor: "bg-[#e5dfc5] hover:bg-[#e5dfc5] text-slate-700 border-transparent",
    payload: '{"id":2, "price":50000}',
  },
];

export default function AdminAuditPage() {
  return (
    <div className="p-10 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">System Audit Trail</h1>
        <p className="text-slate-500 mt-3 text-lg">
          Immutable, read-only records of all system and user activities. Designed for compliance and security oversight.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search actor phone..."
            className="pl-11 h-12 rounded-2xl border-slate-200 bg-white text-base shadow-sm focus-visible:ring-blue-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl h-12 px-3 shadow-sm min-w-[180px]">
            <Calendar className="h-5 w-5 text-slate-400 shrink-0" />
            <Input
              placeholder="Select date..."
              className="border-none shadow-none focus-visible:ring-0 bg-transparent h-full text-base text-slate-600"
            />
          </div>
          
          <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl h-12 px-3 shadow-sm min-w-[180px]">
            <select className="w-full appearance-none border-none bg-transparent h-full text-base text-slate-600 focus:outline-none focus:ring-0 cursor-pointer pl-1 pr-8">
              <option value="">All Actions</option>
              <option value="LOGIN_SUCCESS">LOGIN_SUCCESS</option>
              <option value="INVITATION_SENT">INVITATION_SENT</option>
              <option value="PRODUCT_SAVED">PRODUCT_SAVED</option>
            </select>
            <ChevronDown className="absolute right-3 h-5 w-5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 shadow-sm bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-white hover:bg-white border-slate-100">
              <TableHead className="text-xs font-bold text-slate-500 tracking-wider py-5 pl-6">TIMESTAMP</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 tracking-wider">ACTOR PHONE</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 tracking-wider">ACTION TYPE</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 tracking-wider">PAYLOAD DETAILS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {audits.map((audit) => (
              <TableRow key={audit.id} className="border-slate-100 hover:bg-slate-50/50">
                <TableCell className="text-slate-600 py-6 pl-6">{audit.timestamp}</TableCell>
                <TableCell className="py-6">
                  {audit.isAdmin ? (
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                      <Shield className="h-4 w-4 text-blue-600" />
                      ADMIN
                    </div>
                  ) : (
                    <span className="text-slate-600">{audit.actor}</span>
                  )}
                </TableCell>
                <TableCell className="py-6">
                  <Badge className={`shadow-none font-medium px-3 py-1 rounded-full ${audit.actionColor}`}>
                    {audit.actionType}
                  </Badge>
                </TableCell>
                <TableCell className="py-6">
                  <div className="bg-indigo-50/50 text-indigo-900 border border-indigo-100/50 font-mono text-sm px-4 py-2 rounded-full inline-block">
                    {audit.payload}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-6 py-5 border-t border-slate-100 bg-white">
          <p className="text-sm text-slate-500">
            Showing <span className="font-bold text-slate-700">1</span> to <span className="font-bold text-slate-700">3</span> of <span className="font-bold text-slate-700">1,024</span> results
          </p>
          <div className="flex items-center space-x-1">
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-slate-200 text-slate-400" disabled>
              <span className="text-xs">&lt;</span>
            </Button>
            <Button variant="default" size="icon" className="h-8 w-8 rounded-full bg-blue-600 text-white hover:bg-blue-700 font-medium">
              1
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-slate-600 hover:bg-slate-100 font-medium">
              2
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-slate-600 hover:bg-slate-100 font-medium">
              3
            </Button>
            <span className="text-slate-400 px-1">...</span>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-slate-200 text-slate-600 hover:bg-slate-50">
              <span className="text-xs">&gt;</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
