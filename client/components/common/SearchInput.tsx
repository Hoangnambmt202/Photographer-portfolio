"use client";

import { useDebounce } from "use-debounce";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

interface SearchInputProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  delay?: number;
  className?: string;
  value?:string;
}

export default function SearchInput({
  placeholder = "Tìm kiếm...",
  onSearch,
  delay = 400,
  className = "",
}: SearchInputProps) {
  const [value, setValue] = useState("");
  const [debouncedValue] = useDebounce(value, delay);

  useEffect(() => {
    onSearch(debouncedValue.trim());
  }, [debouncedValue, onSearch]);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-sm"
      />
      {value && (
        <button
          onClick={() => setValue("")}
          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      )}
    </div>
  );
}
