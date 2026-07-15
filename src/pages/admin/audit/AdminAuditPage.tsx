import { useState } from "react";
import { ChevronDown, CheckCircle2, XCircle } from "lucide-react";
import { AdminSearch } from "@/components/admin/ui/AdminSearch";
import { AdminPagination } from "@/components/admin/ui/AdminPagination";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAdminAuditLogs } from "@/hooks/useAdminAuditLogs";
import type { AuditLogParams } from "@/types/audit.type";

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(d);
  } catch (e) {
    return dateStr;
  }
};

const formatPayload = (payload: string) => {
  if (!payload) return "{}";
  try {
    return JSON.stringify(JSON.parse(payload), null, 2);
  } catch (e) {
    return payload;
  }
};

export default function AdminAuditPage() {
  const [params, setParams] = useState<AuditLogParams>({
    actorId: "",
    action: "",
    entityType: "",
    auditStatus: "",
    page: 0,
    size: 20,
    sort: "createdAt,desc"
  });

  const { logs, loading, totalElements, totalPages, error } = useAdminAuditLogs(params);

  const handleFilterChange = (key: keyof AuditLogParams, value: any) => {
    setParams((prev) => ({ ...prev, [key]: value, page: 0 }));
  };

  const startEntry = (params.page || 0) * (params.size || 20) + 1;
  const endEntry = Math.min(((params.page || 0) + 1) * (params.size || 20), totalElements);

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">System Audit Trail</h1>
        <p className="text-slate-500 mt-3 text-lg">
          Immutable, read-only records of all system and user activities. Designed for compliance and security oversight.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <AdminSearch
          placeholder="Search actor ID..."
          className="flex-1 w-full"
          value={params.actorId || ""}
          onChange={(e) => handleFilterChange("actorId", e.target.value)}
        />

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Action Filter */}
          <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl h-12 px-3 shadow-sm min-w-[180px] w-full sm:w-auto">
            <select 
              className="w-full appearance-none border-none bg-transparent h-full text-base text-slate-600 focus:outline-none focus:ring-0 cursor-pointer pl-1 pr-8"
              value={params.action || ""}
              onChange={(e) => handleFilterChange("action", e.target.value)}
            >
              <option value="">All Actions</option>
              <option value="REGISTER">REGISTER</option>
              <option value="LOGIN">LOGIN</option>
              <option value="TRANSACTION_CREATE">TRANSACTION_CREATE</option>
              <option value="COMMISSION_PAYOUT">COMMISSION_PAYOUT</option>
            </select>
            <ChevronDown className="absolute right-3 h-5 w-5 text-slate-400 pointer-events-none" />
          </div>

          {/* Entity Type Filter */}
          <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl h-12 px-3 shadow-sm min-w-[180px] w-full sm:w-auto">
            <select 
              className="w-full appearance-none border-none bg-transparent h-full text-base text-slate-600 focus:outline-none focus:ring-0 cursor-pointer pl-1 pr-8"
              value={params.entityType || ""}
              onChange={(e) => handleFilterChange("entityType", e.target.value)}
            >
              <option value="">All Entities</option>
              <option value="USER">USER</option>
              <option value="INVITATION">INVITATION</option>
              <option value="TRANSACTION">TRANSACTION</option>
              <option value="COMMISSION">COMMISSION</option>
              <option value="PRODUCT">PRODUCT</option>
            </select>
            <ChevronDown className="absolute right-3 h-5 w-5 text-slate-400 pointer-events-none" />
          </div>
          
          {/* Audit Status Filter */}
          <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl h-12 px-3 shadow-sm min-w-[150px] w-full sm:w-auto">
            <select 
              className="w-full appearance-none border-none bg-transparent h-full text-base text-slate-600 focus:outline-none focus:ring-0 cursor-pointer pl-1 pr-8"
              value={params.auditStatus || ""}
              onChange={(e) => handleFilterChange("auditStatus", e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="FAILURE">FAILURE</option>
            </select>
            <ChevronDown className="absolute right-3 h-5 w-5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 shadow-sm bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-white hover:bg-white border-slate-100">
                <TableHead className="text-xs font-bold text-slate-500 tracking-wider py-5 pl-6 whitespace-nowrap">TIMESTAMP</TableHead>
                <TableHead className="text-xs font-bold text-slate-500 tracking-wider whitespace-nowrap">ACTOR ID</TableHead>
                <TableHead className="text-xs font-bold text-slate-500 tracking-wider whitespace-nowrap">ACTION / ENTITY</TableHead>
                <TableHead className="text-xs font-bold text-slate-500 tracking-wider whitespace-nowrap">STATUS / IP</TableHead>
                <TableHead className="text-xs font-bold text-slate-500 tracking-wider whitespace-nowrap text-right pr-6">DETAILS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                    Loading audit logs...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-red-500">
                    {error}
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                    No audit logs found.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((audit) => (
                  <TableRow key={audit.auditLogId} className="border-slate-100 hover:bg-slate-50/50">
                    <TableCell className="text-slate-600 py-4 pl-6 whitespace-nowrap">
                      {formatDateTime(audit.createdAt)}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-sm font-medium text-slate-700 font-mono truncate max-w-[150px] lg:max-w-[200px]" title={audit.actorId}>
                        {audit.actorId || "System"}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-1.5 items-start">
                        <Badge variant="outline" className="bg-indigo-50/50 text-indigo-700 border-indigo-200">
                          {audit.action}
                        </Badge>
                        <span className="text-xs text-slate-500 font-medium px-1">
                          {audit.entityType} • {audit.entityId ? (
                            <span className="font-mono" title={audit.entityId}>{audit.entityId.substring(0, 8)}...</span>
                          ) : (
                            "-"
                          )}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-1.5 items-start">
                        {audit.auditStatus === "SUCCESS" ? (
                          <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold tracking-wide">
                            <CheckCircle2 className="w-3.5 h-3.5" /> SUCCESS
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-red-600 text-xs font-bold tracking-wide">
                            <XCircle className="w-3.5 h-3.5" /> FAILURE
                          </div>
                        )}
                        <span className="text-xs text-slate-500 font-mono">
                          {audit.ipAddress}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 pr-6 text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 rounded-lg shadow-sm border-slate-200 hover:bg-slate-50">
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[95vw] sm:max-w-3xl bg-white p-0 overflow-hidden border-slate-200 rounded-2xl shadow-xl">
                          <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100 bg-slate-50/50">
                            <DialogTitle className="text-xl font-bold text-slate-900">Audit Log Details</DialogTitle>
                          </DialogHeader>
                          
                          <div className="p-6 max-h-[85vh] overflow-y-auto flex flex-col gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Meta Info */}
                              <div className="flex flex-col gap-4 bg-slate-50 p-5 rounded-xl border border-slate-100">
                                 <div className="flex flex-col gap-1">
                                   <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Log ID</span>
                                   <span className="text-sm text-slate-700 font-mono break-all">{audit.auditLogId}</span>
                                 </div>
                                 <div className="flex flex-col gap-1">
                                   <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Actor ID</span>
                                   <span className="text-sm text-slate-700 font-mono break-all">{audit.actorId || "System"}</span>
                                 </div>
                                 <div className="flex flex-col gap-1">
                                   <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Entity ID</span>
                                   <span className="text-sm text-slate-700 font-mono break-all">{audit.entityId || "-"}</span>
                                 </div>
                              </div>
                              
                              {/* User Agent */}
                              <div className="flex flex-col gap-2">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">User Agent</span>
                                <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 text-sm break-words h-full leading-relaxed">
                                  {audit.userAgent ? (
                                    <span className="text-slate-600">{audit.userAgent}</span>
                                  ) : (
                                    <span className="text-slate-400 italic">No User Agent data recorded by system.</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {/* Payload */}
                            <div className="flex flex-col gap-2">
                              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Payload Data</span>
                              <div className="bg-slate-900 rounded-xl p-5 overflow-x-auto shadow-inner">
                                <pre className="text-sm text-emerald-400 font-mono leading-relaxed">
                                  {formatPayload(audit.payload)}
                                </pre>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {totalElements > 0 && (
          <AdminPagination 
            currentPage={(params.page || 0) + 1} 
            totalPages={totalPages} 
            startEntry={startEntry} 
            endEntry={endEntry} 
            totalEntries={totalElements} 
            onPageChange={(p) => setParams((prev) => ({ ...prev, page: p - 1 }))}
          />
        )}
      </div>
    </div>
  );
}
