import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminUserApi } from "@/lib/api/admin-user.api";
import toast from "react-hot-toast";

export const adminUsersQueryKey = ["admin-users"];

export function useAdminUsersQuery(q: string, status: string, isDeleted: string, page: number, size: number) {
  return useQuery({
    queryKey: [...adminUsersQueryKey, q, status, isDeleted, page, size],
    queryFn: () => adminUserApi.searchUsers(q, status, isDeleted, page, size),
    staleTime: 30_000,
  });
}

export function useSoftDeleteUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => adminUserApi.softDeleteUser(userId),
    onSuccess: () => {
      toast.success("Akun agen berhasil dinonaktifkan!");
      queryClient.invalidateQueries({ queryKey: adminUsersQueryKey });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Gagal menghapus akun agen.";
      toast.error(msg);
    },
  });
}
