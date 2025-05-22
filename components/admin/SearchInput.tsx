// components/SearchInput.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

interface SearchInputProps {
  placeholder?: string;
  onSearch: (term: string) => void;
  className?: string;
}

export function SearchInput({
  placeholder = "Cari...",
  onSearch,
  className = "",
}: SearchInputProps) {
  const debouncedSearch = useDebouncedCallback((term: string) => {
    onSearch(term);
  }, 500);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-8"
        onChange={(e) => debouncedSearch(e.target.value)}
      />
    </div>
  );
}
