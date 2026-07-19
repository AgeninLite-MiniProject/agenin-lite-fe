import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Phone, Clock } from "lucide-react";
import { useReceivedPendingInvitationsQuery } from "@/hooks/useReceivedInvitations";
import { useAcceptInvitationMutation } from "@/hooks/useAcceptInvitation";
import { useDeclineInvitationMutation } from "@/hooks/useDeclineInvitation";
import { ErrorState } from "@/components/ui/ErrorState";
import Image500 from "@/assets/500-error.webp";

export default function IncomingInvitationsPage() {
  // The live PENDING inbox from the BE.
  // isLoading covers the initial fetch (no cached data yet).
  // isError is set if the GET /api/invitations/received call fails.
  const {
    data: inbox,
    isLoading,
    isError,
  } = useReceivedPendingInvitationsQuery();

  const acceptMutation = useAcceptInvitationMutation();
  const declineMutation = useDeclineInvitationMutation();

  // Shared "in-flight" flag so BOTH buttons get disabled during a
  // mutation, no matter which one was clicked. Same pattern as
  // FE-003's cancel button (one mutation, one flag).
  const isMutating =
    acceptMutation.isPending || declineMutation.isPending;

  // ── Helpers ──
  //
  // "createdAt" is an ISO string from the BE (e.g. "2026-07-14T10:30:00").
  // We turn it into a friendly Indonesian relative time for the row.
  // No date-fns dep added — 10 lines, no need.
  const formatRelativeTime = (iso: string): string => {
    const then = new Date(iso).getTime();
    if (Number.isNaN(then)) return ""; // safety: never crash the row
    const now = Date.now();
    const diffMs = now - then;
    const diffMin = Math.floor(diffMs / 60_000);
    if (diffMin < 1) return "Baru saja";
    if (diffMin < 60) return `Dikirim ${diffMin} menit yang lalu`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `Dikirim ${diffHour} jam yang lalu`;
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay === 1) return "Dikirim 1 hari yang lalu";
    return `Dikirim ${diffDay} hari yang lalu`;
  };

  // First-letter initial of the inviter's name for the avatar circle.
  // "Budi Santoso" → "B", "Siti Aminah" → "S". Matches DownlinePage
  // and SendInvitationPage's avatar pattern.
  const initials = (name: string): string =>
    name.trim().charAt(0).toUpperCase() || "?";

  // The list, memoized to keep the render block clean.
  const invitations = useMemo(() => inbox?.invitations ?? [], [inbox]);

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 max-w-4xl mx-auto w-full min-h-[calc(100vh-140px)]">
      {/* BACK BUTTON */}
      <div className="mb-6 md:mb-10 pt-4">
        <Link
          to="/downline"
          className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft className="h-6 w-6" strokeWidth={2.5} />
        </Link>
      </div>

      {/* HEADER INFO */}
      <div className="mb-8 md:mb-12 max-w-2xl">
        <h1 className="text-3xl md:text-[34px] font-heading font-bold text-slate-900 mb-4 tracking-tight">
          Undangan Jaringan Masuk
        </h1>
        <p className="text-slate-500 text-[15px] leading-relaxed">
          Pilih salah satu undangan untuk bergabung ke jaringan Agent. Setelah
          Anda menerima satu undangan, undangan lainnya akan otomatis
          dibatalkan.
        </p>
      </div>

      {/* LIST OF INVITATIONS — 4-STATE PATTERN */}
      <div className="space-y-3">
        {/* 1. LOADING */}
        {isLoading && (
          <div className="p-6 text-sm text-slate-500 text-center">
            Memuat daftar undangan...
          </div>
        )}

        {/* 2. ERROR */}
        {!isLoading && isError && (
          <ErrorState 
            title="Gagal memuat daftar undangan"
            message="Terjadi kesalahan sistem saat menghubungi server."
            imageSrc={Image500}
          />
        )}

        {/* 3. EMPTY */}
        {!isLoading && !isError && invitations.length === 0 && (
          <div className="p-6 text-sm text-slate-400 text-center">
            Belum ada undangan yang masuk.
          </div>
        )}

        {/* 4. LIST — the actual rows */}
        {!isLoading && !isError && invitations.length > 0 &&
          invitations.map((inv) => (
            <Card key={inv.inviterId} className="rounded-xl border-slate-100 shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden">
              <CardContent className="px-5 py-4 md:px-6 md:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <Avatar className="h-11 w-11 border border-slate-100 shadow-sm">
                    {/* src is null for now — <AvatarImage> handles null
                        gracefully and renders the <AvatarFallback>. */}
                    <AvatarImage src={inv.inviterAvatarUrl ?? undefined} alt={inv.inviterName} />
                    <AvatarFallback>{initials(inv.inviterName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-[15px] text-slate-900 leading-tight">{inv.inviterName}</h3>
                    <div className="flex items-center gap-2.5 text-xs text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Phone className="h-3 w-3" />
                        {inv.inviterPhone}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="h-3 w-3" />
                        {formatRelativeTime(inv.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0">
                  <Button
                    variant="outline"
                    disabled={isMutating}
                    onClick={() => declineMutation.mutate(inv.inviterId)}
                    className="flex-1 sm:flex-none rounded-full px-5 text-slate-600 border-slate-300 hover:bg-slate-50 font-semibold h-9 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Tolak
                  </Button>
                  <Button
                    disabled={isMutating}
                    onClick={() => acceptMutation.mutate(inv.inviterId)}
                    className="flex-1 sm:flex-none rounded-full px-5 bg-[#004cd1] hover:bg-[#004cd1]/90 text-white font-semibold h-9 text-[13px] shadow-[0_4px_14px_0_rgba(0,76,209,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Terima Undangan
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
