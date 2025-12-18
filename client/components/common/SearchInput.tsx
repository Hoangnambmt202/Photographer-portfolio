"use client";
import { useDebounce } from "use-debounce";
import { useEffect } from "react";
import { Search } from "lucide-react";
import LoaderInline from "./LoaderInline";

interface SearchInputProps {
  placeholder?: string;
  delay?: number;
  className?: string;
  value: string;
  loading?: boolean;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
}

export default function SearchInput({
  placeholder = "Tìm kiếm...",
  onSearch,
  delay = 400,
  className = "",
  value,
  onChange,
  loading = false,
}: SearchInputProps) {
  const [debouncedValue] = useDebounce(value, delay);

  useEffect(() => {
    onSearch((debouncedValue ?? "").trim());
  }, [debouncedValue, onSearch]);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm"
      />
      <div className="absolute right-3 top-2.5">
        {loading ? (
          <LoaderInline size={18} />
        ) : value ? (
          <button
            onClick={() => onChange("")}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        ) : null}
      </div>
    </div>
  );
}
