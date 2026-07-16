import { useEffect, useMemo, useRef, useState } from "react";
import { usePhoneSearchQuery } from "@/hooks/usePhoneSearch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Play, Search, X, Check } from "lucide-react";
import toast from "react-hot-toast";
import type { PhoneSearchUser } from "@/lib/api/phone-search.api";
import { useSentPendingInvitationsQuery } from "@/hooks/useSentInvitations";
import { useSendInvitationMutation } from "@/hooks/useSendInvitation";
import { useCancelInvitationMutation } from "@/hooks/useCancelInvitation";

type SearchPhase = "idle" | "searching" | "results" | "empty" | "too-short";

export default function SendInvitationPage() {
  // The phone-prefix search query (the only form input left)
  const [phoneQuery, setPhoneQuery] = useState("");
  const [debouncedPhone, setDebouncedPhone] = useState("");
  const [results, setResults] = useState<PhoneSearchUser[]>([]);
  const [phase, setPhase] = useState<SearchPhase>("idle");
  // The user the inviter has picked from the result list
  const [picked, setPicked] = useState<PhoneSearchUser | null>(null);
  const handlePick = (u: PhoneSearchUser) => setPicked(u);
  const handleClearPick = () => setPicked(null);

  // Debounce the search-as-you-type
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    const q = phoneQuery.trim();

    if (!q) {
      setDebouncedPhone("");
      setResults([]);
      setPhase("idle");
      setPicked(null);
      return;
    }
    if (q.length < 3) {
      setDebouncedPhone("");
      setResults([]);
      setPhase("too-short");
      return;
    }

    setPhase("searching");
    debounceTimer.current = setTimeout(() => {
      setDebouncedPhone(q);
    }, 300);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [phoneQuery]);

  const {
    data,
    isFetching,
    isError,
    error,
  } = usePhoneSearchQuery(debouncedPhone);

  const hits = useMemo(() => data ?? [], [data]);

  const {
    data: pendingList,
    isLoading: isPendingListLoading,
    isError: isPendingListError,
  } = useSentPendingInvitationsQuery();

  const sendMutation = useSendInvitationMutation();

  const cancelMutation = useCancelInvitationMutation();

  const showResultsPanel =
    phase === "results" ||
    phase === "empty" ||
    phase === "searching" ||
    phase === "too-short";

  useEffect(() => {
    // If the hook is disabled (debouncedPhone empty or <3 chars), the page's
    // first useEffect already set the right phase. Nothing to do here.
    if (!debouncedPhone || debouncedPhone.length < 3) return;

    if (isError) {
      setResults([]);
      setPhase("empty");
      // Surface the error to the user. The hook has already retried once.
      const msg =
        (error as any)?.response?.data?.message ??
        "Gagal mencari user. Coba lagi sebentar.";
      toast.error(msg);
      return;
    }
    if (isFetching && hits.length === 0) {
      setPhase("searching");
      return;
    }
    // Settled response (possibly empty).
    setResults(hits);
    setPhase(hits.length === 0 ? "empty" : "results");
    // If the picked user is no longer in the result set, drop the pick.
    setPicked((prev) =>
      prev && hits.some((u) => u.user_id === prev.user_id) ? prev : null,
    );
  }, [debouncedPhone, isFetching, isError, hits, error]);

  // Picked-user initials (e.g. "Budi Santoso" -> "BS")
  const pickedInitials = useMemo(() => {
    if (!picked) return "";
    return picked.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]!.toUpperCase())
      .join("");
  }, [picked]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!picked) {
      toast.error("Pilih calon agent dari hasil pencarian terlebih dahulu.");
      return;
    }
    if (isCapFull) {
      toast.error("Sudah 3 undangan menunggu — batalkan salah satu untuk mengirim lagi.");
      return;
    }
    sendMutation.mutate(
      { phoneNumber: picked.phone },
      {
        onSuccess: () => {
          setPhoneQuery("");
          setDebouncedPhone("");
          setResults([]);
          setPhase("idle");
          setPicked(null);
        },
      },
    );
  };

  const handleCancel = (inviteeId: string) => {
    cancelMutation.mutate(inviteeId);
  };

  const pendingCount = pendingList?.pendingCount ?? 0;
  const pendingCap = pendingList?.pendingCap ?? 3;
  const isCapFull = pendingCount >= pendingCap;

  return (
    <div className="flex-1 p-4 md:p-8 max-w-[1000px] mx-auto w-full flex items-center justify-center min-h-[calc(100vh-140px)]">
      <Card className="w-full rounded-[32px] border-slate-200/60 shadow-sm overflow-hidden bg-white flex flex-col md:flex-row">
        {/* LEFT COLUMN - SEARCH + PICK */}
        <div className="flex-1 p-8 md:p-12 border-b md:border-b-0 border-slate-100/80">
          <h1 className="text-3xl md:text-[34px] font-heading font-bold text-slate-900 leading-[1.15] mb-4">
            Kirim Undangan
            <br />
            Agent
            <br />
            Baru
          </h1>
          <p className="text-slate-500 mb-10 leading-relaxed text-[15px] max-w-sm">
            Cari agent yang sudah terdaftar berdasarkan nomor WhatsApp-nya, lalu
            pilih dari hasil pencarian untuk diundang menjadi downline Anda.
          </p>

          <form className="space-y-6 max-w-sm" onSubmit={handleSubmit}>
            {/* Phone-prefix search input */}
            <div className="space-y-2.5">
              <Label className="text-[13px] font-bold text-slate-600">
                Cari Nomor Telepon
              </Label>
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  inputMode="numeric"
                  placeholder="Ketik minimal 3 digit nomor..."
                  className="rounded-full h-12 pl-11 pr-5 border-slate-200/80 bg-white"
                  value={phoneQuery}
                  onChange={(e) => setPhoneQuery(e.target.value)}
                />
              </div>
              <p className="text-[11px] text-slate-400 px-1">
                Hasil pencarian akan muncul di bawah saat Anda mengetik.
              </p>
            </div>

            {/* Live search result panel (appears under the input) */}
            {showResultsPanel && (
              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                {phase === "searching" && (
                  <div className="p-4 text-sm text-slate-500 text-center">
                    Mencari...
                  </div>
                )}

                {phase === "too-short" && (
                  <div className="p-4 text-sm text-slate-400 text-center">
                    Ketik minimal 3 digit nomor untuk mulai mencari.
                  </div>
                )}

                {phase === "empty" && (
                  <div className="p-4 text-sm text-slate-500">
                    <p className="font-medium text-slate-700">
                      Nomor tidak ditemukan.
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Pastikan calon agent sudah pernah registrasi di
                      AgeninLite.
                    </p>
                  </div>
                )}

                {phase === "results" && (
                  <ul className="divide-y divide-slate-100 max-h-[280px] overflow-y-auto">
                    {results.map((u) => {
                      const isPicked = picked?.user_id === u.user_id;
                      return (
                        <li key={u.user_id}>
                          <button
                            type="button"
                            onClick={() => handlePick(u)}
                            className={`w-full flex items-center gap-3 p-3 pl-4 text-left transition-colors ${
                              isPicked ? "bg-primary/5" : "hover:bg-slate-50"
                            }`}
                          >
                            <div
                              className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                                isPicked
                                  ? "bg-primary text-white"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-900 text-sm leading-tight truncate">
                                {u.name}
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {u.phone}
                              </p>
                            </div>
                            {isPicked ? (
                              <Check className="h-4 w-4 text-primary shrink-0" />
                            ) : (
                              <Badge
                                variant="secondary"
                                className={`text-[10px] font-bold px-2 py-0.5 border-transparent ${
                                  u.status === "ACTIVE"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-slate-200 text-slate-700"
                                }`}
                              >
                                {u.status}
                              </Badge>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}

            {/* Picked user — the actual invite target, shown only when something is selected */}
            {picked && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3.5 pl-4 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-full bg-emerald-200/70 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                    {pickedInitials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-emerald-700 font-semibold uppercase tracking-wider">
                      Akan diundang
                    </p>
                    <p className="font-semibold text-slate-900 text-sm leading-tight truncate">
                      {picked.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {picked.phone}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClearPick}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-white"
                  aria-label="Batalkan pilihan"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            <Button
              type="submit"
              disabled={!picked || isCapFull || isPendingListLoading}
              className="w-full rounded-full h-12 mt-4 text-[14px] font-semibold bg-primary hover:bg-primary/90 disabled:bg-slate-200 disabled:text-slate-400"
            >
              Kirim Undangan Sekarang
              <Play className="ml-2 h-3.5 w-3.5 fill-current" />
            </Button>
            {isCapFull && (
              <p className="text-[11px] text-amber-600 px-1 -mt-3">
                Sudah 3 undangan menunggu, batalkan salah satu untuk mengirim lagi.
              </p>
            )}
          </form>
        </div>

        {/* RIGHT COLUMN - PENDING LIST */}
        <div className="flex-1 p-8 md:p-12 bg-white flex flex-col border-t md:border-t-0 md:border-l border-slate-100/80">
          <h3 className="font-bold text-slate-900 mb-6 text-[15px]">
            {isPendingListLoading
              ? "Menunggu Konfirmasi (memuat...)"
              : `Menunggu Konfirmasi (${pendingCount}/${pendingCap})`}
          </h3>

          {isPendingListLoading && (
            <div className="p-4 text-sm text-slate-500 text-center">
              Memuat daftar undangan...
            </div>
          )}

          {isPendingListError && !isPendingListLoading && (
            <div className="p-4 text-sm text-slate-500">
              <p className="font-medium text-slate-700">Gagal memuat daftar undangan.</p>
              <p className="text-xs text-slate-500 mt-1">
                Coba muat ulang halaman.
              </p>
            </div>
          )}

          {!isPendingListLoading && !isPendingListError &&
           pendingList && pendingList.invitations.length === 0 && (
            <div className="p-4 text-sm text-slate-400 text-center">
              Belum ada undangan yang menunggu.
            </div>
          )}

          {!isPendingListLoading && !isPendingListError &&
           pendingList && pendingList.invitations.length > 0 && (
            <div className="space-y-4">
              {pendingList.invitations.map((item) => (
                <div
                  key={item.inviteeId}
                  className="flex items-center justify-between p-3.5 pl-4 rounded-[28px] border border-slate-200/80 bg-white"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="h-10 w-10 rounded-full bg-[#E8E2CD] flex items-center justify-center text-[#5A5030] font-bold text-sm shrink-0">
                      {item.inviteeName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 text-sm leading-tight truncate">
                        {item.inviteeName}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.inviteePhone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge
                      variant="secondary"
                      className="bg-[#E8E2CD]/60 text-[#5A5030] hover:bg-[#E8E2CD]/60 border-transparent text-[10px] font-bold px-3 py-1"
                    >
                      PENDING
                    </Badge>
                    <button
                      type="button"
                      onClick={() => handleCancel(item.inviteeId)}
                      disabled={cancelMutation.isPending}
                      className="text-[11px] font-medium text-slate-500 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Batalkan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-auto pt-16 text-center">
            <p className="text-[13px] text-slate-500 font-medium">
              Maksimal {pendingCap} undangan aktif sekaligus.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
