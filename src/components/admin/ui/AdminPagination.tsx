import { Button } from "@/components/ui/button";

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  startEntry: number;
  endEntry: number;
  totalEntries: number;
  onPageChange: (page: number) => void;
}

export function AdminPagination({
  currentPage,
  totalPages,
  startEntry,
  endEntry,
  totalEntries,
  onPageChange,
}: AdminPaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-100 bg-white gap-4">
      <p className="text-sm text-slate-500 font-medium">
        Showing {startEntry} to {endEntry} of {totalEntries} entries
      </p>
      <div className="flex items-center space-x-1">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 px-4 rounded-lg border-slate-200 text-slate-500 font-medium hover:bg-slate-50"
          disabled={currentPage <= 1 || totalEntries === 0}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Prev
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          className="h-9 w-9 p-0 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium"
        >
          {totalEntries === 0 ? 0 : currentPage}
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 px-4 rounded-lg border-slate-200 text-slate-500 font-medium hover:bg-slate-50"
          disabled={currentPage >= totalPages || totalEntries === 0}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
