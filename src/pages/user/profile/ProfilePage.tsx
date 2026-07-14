import React from "react";
import { Copy, Mail, Phone, Link as LinkIcon, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  // TODO: Fetch dari API /dashboard
  const user = {
    name: "Budi Santoso",
    email: "budi@email.com",
    phone: "+628123456789",
    status: "ACTIVE",
    referral_code: "AGN-B8X9",
    referred_by_name: "Andi Wijaya",
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
                src="https://ui-avatars.com/api/?name=Budi+Santoso&background=1d4ed8&color=fff&size=200" 
                alt="Profile Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Status Badge */}
            <div className="absolute -bottom-3 bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest flex items-center gap-1.5 border-2 border-white shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              ACTIVE
            </div>
          </div>

          {/* Name & Contact */}
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 font-serif tracking-tight">
              {user.name}
            </h2>
            <div className="flex items-center justify-center gap-4 mt-3 text-sm text-gray-500 font-medium">
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-blue-600" />
                {user.email}
              </div>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <div className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-blue-600" />
                {user.phone}
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
                <button className="text-gray-400 hover:text-blue-600 transition-colors">
                  <Copy className="w-4 h-4" />
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
                    {user.referred_by_name}
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
