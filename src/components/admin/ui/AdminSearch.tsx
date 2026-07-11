import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AdminSearchProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export function AdminSearch({
  placeholder = "Search...",
  value,
  onChange,
  className = "",
}: AdminSearchProps) {
  return (
    <div className={`relative flex items-center bg-white rounded-3xl border border-slate-200 shadow-sm ${className}`}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-12 h-12 w-full border-none shadow-none focus-visible:ring-0 bg-transparent text-base rounded-3xl"
      />
    </div>
  );
}
