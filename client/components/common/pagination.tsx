import { ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number; // thêm tổng số item
  itemsPerPage: number; // số item trên 1 trang
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between border-t border-white/10 px-4 py-3 sm:px-6">
      {/* Mobile */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          className="relative inline-flex items-center rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-400 hover:bg-white/10"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          className="relative ml-3 inline-flex items-center rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-400 hover:bg-white/10"
        >
          Next
        </button>
      </div>

      {/* Desktop */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">
            Hiển thị <span className="font-medium">{startItem}</span> đến{" "}
            <span className="font-medium">{endItem}</span> của{" "}
            <span className="font-medium">{totalItems}</span> kết quả
          </p>
        </div>
        <div>
          <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md">
            <button
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 hover:bg-white/5 focus:outline-none"
            >
              <span className="sr-only">Previous</span>
              <ChevronsLeftIcon aria-hidden="true" className="w-5 h-5" />
            </button>

            {pages.map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                  page === currentPage
                    ? "z-10 bg-indigo-500 text-white"
                    : "text-gray-400 hover:bg-white/5"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 hover:bg-white/5 focus:outline-none"
            >
              <span className="sr-only">Next</span>
              <ChevronsRightIcon aria-hidden="true" className="w-5 h-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
