import { useState, useEffect } from "react";
import { adminAuditApi } from "@/lib/api/admin-audit.api";
import type { AuditLog, AuditLogParams } from "@/types/audit.type";
import { useDebounce } from "@/hooks/useDebounce";

export function useAdminAuditLogs(params: AuditLogParams, debounceDelay = 500) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Debounce the actorId
  const debouncedActorId = useDebounce(params.actorId, debounceDelay);

  useEffect(() => {
    let isMounted = true;

    const fetchLogs = async () => {
      if (debouncedActorId) {
        const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i;
        if (!uuidRegex.test(debouncedActorId)) {
          if (isMounted) {
            setLogs([]);
            setTotalElements(0);
            setTotalPages(1);
            setError("Format Actor ID tidak valid. Harap masukkan UUID yang benar.");
            setLoading(false);
          }
          return;
        }
      }

      setLoading(true);
      setError(null);
      try {
        const response = await adminAuditApi.getAuditLogs({
          ...params,
          actorId: debouncedActorId,
        });

        if (isMounted && response.success) {
          setLogs(response.data.content);
          setTotalElements(response.data.totalElements);
          setTotalPages(response.data.totalPages);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to fetch audit logs");
          setLogs([]);
          setTotalElements(0);
          setTotalPages(1);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchLogs();

    return () => {
      isMounted = false;
    };
  }, [
    debouncedActorId,
    params.action,
    params.entityType,
    params.auditStatus,
    params.page,
    params.size,
    params.sort,
  ]);

  return { logs, loading, totalElements, totalPages, error };
}
