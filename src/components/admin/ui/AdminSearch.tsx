import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AdminSearchProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export function AdminSearch({ placeholder, value, onChange, className = "" }: AdminSearchProps) {
  return (
    <div className={`relative max-w-md ${className}`}>
      <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
      <Input
        placeholder={placeholder || "Search..."}
        value={value}
        onChange={onChange}
        className="pl-11 h-12 rounded-2xl border-slate-200 bg-white text-base shadow-sm focus-visible:ring-blue-500"
      />
    </div>
  );
}
