import React, { useState } from "react";
import { Copy, Mail, Phone, Link as LinkIcon, User, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboardSummary } from "@/hooks/useDashboard";

export default function ProfilePage() {
  const { data: dashboard, isLoading, isError } = useDashboardSummary();
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return (
      <div className="flex-1 p-4 md:p-8 w-full max-w-5xl mx-auto flex items-center justify-center min-h-[calc(100vh-80px)]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError || !dashboard) {
    return (
      <div className="flex-1 p-4 md:p-8 w-full max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <p className="text-destructive font-semibold text-lg mb-2">Gagal memuat profil</p>
      </div>
    );
  }

  const user = dashboard.user;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(user.referral_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 p-4 md:p-8 w-full max-w-5xl mx-auto flex items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Background */}
        <div className="h-32 bg-blue-100/70 w-full relative"></div>

        {/* Profile Content */}
        <div className="px-8 pb-10 flex flex-col items-center">
          
          {/* Avatar Section */}
          <div className="relative -mt-16 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-gray-200">
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_name)}&background=1d4ed8&color=fff&size=200`} 
                alt="Profile Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Status Badge */}
            <div className="absolute -bottom-3 bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest flex items-center gap-1.5 border-2 border-white shadow-sm">
              {user.user_status === "ACTIVE" && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>}
              {user.user_status}
            </div>
          </div>

          {/* Name & Contact */}
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 font-serif tracking-tight">
              {user.user_name}
            </h2>
            <div className="flex items-center justify-center gap-4 mt-3 text-sm text-gray-500 font-medium">
              {user.email && (
                <>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-blue-600" />
                    {user.email}
                  </div>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                </>
              )}
              <div className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-blue-600" />
                {user.phone_number}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gray-100 my-8"></div>

          {/* Network Info Cards */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Referral Code Card */}
            <div className="bg-slate-50/80 rounded-3xl p-6 flex flex-col items-center justify-center text-center border border-slate-100">
              <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-3">
                YOUR REFERRAL CODE
              </p>
              
              <div className="bg-white px-4 py-2.5 rounded-full shadow-sm border border-gray-100 flex items-center justify-between gap-6 w-full max-w-[200px]">
                <span className="text-blue-700 font-bold tracking-wide">
                  {user.referral_code}
                </span>
                <button onClick={handleCopyCode} className="text-gray-400 hover:text-blue-600 transition-colors">
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <p className="text-xs text-gray-400 mt-4 leading-relaxed max-w-[200px]">
                Share this code to invite new partners to your network.
              </p>
            </div>

            {/* Referred By Card */}
            <div className="bg-slate-50/80 rounded-3xl p-6 flex flex-col items-center justify-center text-center border border-slate-100">
              <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-4">
                REFERRED BY
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-200">
                  <User className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-bold text-gray-900">
                    {user.referred_by || "Pusat (HQ)"}
                  </h4>
                  <a href="#" className="flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-700 mt-0.5">
                    <LinkIcon className="w-3 h-3" />
                    View Profile
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
