import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface AdminPaginationProps {
  currentPage?: number;
  totalPages?: number;
  startEntry?: number;
  endEntry?: number;
  totalEntries?: number;
  onPageChange?: (page: number) => void;
}

export function AdminPagination({
  currentPage = 1,
  totalPages = 1,
  startEntry = 1,
  endEntry = 3,
  totalEntries = 3,
  onPageChange
}: AdminPaginationProps) {

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages.map((page, index) => {
      if (page === '...') {
        return (
          <div key={`ellipsis-${index}`} className="flex items-center justify-center px-1 text-slate-400">
            <MoreHorizontal className="h-4 w-4" />
          </div>
        );
      }

      const isActive = page === currentPage;
      return (
        <Button
          key={page}
          variant={isActive ? "default" : "outline"}
          size="sm"
          className={`h-9 w-9 p-0 rounded-lg font-medium ${isActive
              ? "bg-blue-600 text-white hover:bg-blue-700 border-transparent shadow-sm"
              : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          onClick={() => typeof page === 'number' && onPageChange?.(page)}
        >
          {page}
        </Button>
      );
    });
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-white">
      <p className="text-sm text-slate-500 font-medium">
        Showing <span className="font-semibold text-slate-700">{startEntry}</span> to <span className="font-semibold text-slate-700">{endEntry}</span> of <span className="font-semibold text-slate-700">{totalEntries}</span> entries
      </p>
      <div className="flex items-center space-x-1.5">
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-3 rounded-lg border-slate-200 text-slate-600 font-medium hover:bg-slate-50 gap-1"
          disabled={currentPage <= 1}
          onClick={() => onPageChange?.(currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Prev</span>
        </Button>

        {renderPageNumbers()}

        <Button
          variant="outline"
          size="sm"
          className="h-9 px-3 rounded-lg border-slate-200 text-slate-600 font-medium hover:bg-slate-50 gap-1"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange?.(currentPage + 1)}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
