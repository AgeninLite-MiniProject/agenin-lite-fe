import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminUserApi } from "@/lib/api/admin-user.api";
import { AdminSearch } from "@/components/admin/ui/AdminSearch";
import { AdminPagination } from "@/components/admin/ui/AdminPagination";
import { Button } from "@/components/ui/button";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  
  // State for search and pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [deletedFilter, setDeletedFilter] = useState("ALL");
  const [page, setPage] = useState(0);
  const size = 10;
  
  // State for delete modal
  const [userToDelete, setUserToDelete] = useState<{ id: string, name: string } | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', searchQuery, page, size],
    queryFn: () => adminUserApi.searchUsers(searchQuery, page, size),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: adminUserApi.softDeleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setUserToDelete(null);
      setDeleteError("");
    },
    onError: (error: any) => {
      setDeleteError(error.response?.data?.message || "Failed to delete user. Please try again.");
    }
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(0); // Reset ke page pertama tiap kali ngetik search
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete.id);
    }
  };

  const users = data?.content || [];
  
  // Client-side filtering
  let filteredUsers = users;
  if (statusFilter !== "ALL") {
    filteredUsers = filteredUsers.filter((u: any) => u.user_status === statusFilter);
  }
  if (deletedFilter !== "ALL") {
    const isDeleted = deletedFilter === "TRUE";
    filteredUsers = filteredUsers.filter((u: any) => u.is_deleted === isDeleted);
  }

  const totalElements = data?.totalElements || 0;
  const totalPages = data?.totalPages || 1;
  const startEntry = totalElements === 0 ? 0 : page * size + 1;
  const endEntry = Math.min((page + 1) * size, totalElements);

  return (
    <div className="p-10 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Management</h1>
        <p className="text-slate-500 mt-2 text-lg">
          Monitor registered agents and manage account suspensions.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <AdminSearch 
          placeholder="Search by name or phone number..." 
          value={searchQuery}
          onChange={handleSearch}
          className="w-full md:w-[400px]"
        />

        <div className="flex gap-4">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-12 px-4 rounded-2xl border-slate-200 bg-white text-slate-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border cursor-pointer font-medium text-sm"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="PASSIVE">PASSIVE</option>
          </select>

          <select 
            value={deletedFilter} 
            onChange={(e) => setDeletedFilter(e.target.value)}
            className="h-12 px-4 rounded-2xl border-slate-200 bg-white text-slate-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border cursor-pointer font-medium text-sm"
          >
            <option value="ALL">All Accounts</option>
            <option value="FALSE">Not Deleted</option>
            <option value="TRUE">Deleted</option>
          </select>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 shadow-sm bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-slate-100">
              <TableHead className="text-xs font-bold text-slate-500 tracking-wider py-4 pl-6">ID</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 tracking-wider">AGENT NAME</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 tracking-wider">ROLE</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 tracking-wider">STATUS</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 tracking-wider">IS DELETED?</TableHead>
              <TableHead className="text-xs font-bold text-slate-500 tracking-wider text-right pr-6">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-slate-500">Loading users...</TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-slate-500">No users found.</TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user: any) => (
                <TableRow key={user.user_id} className="border-slate-100 hover:bg-slate-50/50">
                  <TableCell className="font-medium text-slate-500 py-4 pl-6 text-xs max-w-[120px] truncate" title={user.user_id}>
                    {user.user_id.substring(0, 8)}...
                  </TableCell>
                  <TableCell className={`font-semibold py-4 ${user.is_deleted ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                    {user.name}
                  </TableCell>
                  <TableCell className={`py-4 ${user.is_deleted ? 'text-slate-400' : 'text-slate-600'}`}>
                    <Badge variant="outline" className="text-xs">{user.role}</Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge
                      variant="secondary"
                      className={`shadow-none border-transparent font-semibold ${
                        user.user_status === "ACTIVE"
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                      }`}
                    >
                      {user.user_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge
                      variant="secondary"
                      className={`shadow-none border-transparent font-semibold ${
                        user.is_deleted
                          ? "bg-red-100 text-red-700 hover:bg-red-100"
                          : "bg-indigo-50 text-indigo-700 hover:bg-indigo-50"
                      }`}
                    >
                      {user.is_deleted ? "TRUE" : "FALSE"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6 py-4">
                    {!user.is_deleted ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setUserToDelete({ id: user.user_id, name: user.name })}
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 font-semibold rounded-full px-4"
                      >
                        Delete
                      </Button>
                    ) : (
                      <span className="text-sm text-slate-400 font-medium">No action</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        {users.length > 0 && (
          <AdminPagination 
            currentPage={page + 1} 
            totalPages={totalPages} 
            startEntry={startEntry} 
            endEntry={endEntry} 
            totalEntries={totalElements} 
            onPageChange={(newPage) => setPage(newPage - 1)}
          />
        )}
      </div>

      <Dialog open={!!userToDelete} onOpenChange={(open) => {
        if (!open) {
          setUserToDelete(null);
          setDeleteError("");
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the account for <strong className="text-slate-800">{userToDelete?.name}</strong>? 
              This action will mark the user as deleted and prevent them from logging in.
            </DialogDescription>
          </DialogHeader>
          
          {deleteError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm mt-2 font-medium">
              {deleteError}
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setUserToDelete(null)} disabled={deleteMutation.isPending}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Deleting..." : "Yes, Delete Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
