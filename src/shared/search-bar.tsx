"use client";

import IonIcon from "@shared/IonIcon";
import { useState } from "react";

type SearchBarProps = {
  placeholder: string;
  onsearch: (query: string) => void;
};

const SearchBar = ({ placeholder, onsearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onsearch(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center justify-between w-full px-5 py-3 bg-neutral-100 rounded-lg gap-3">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none body-large placeholder:text-neutral-400 text-black title-large-primary"
      />
      <button
        type="button"
        onClick={handleSearch}
        aria-label="Search"
        className="cursor-pointer"
      >
        <IonIcon name="SearchOutline" size="24px" className="text-primary" />
      </button>
    </div>
  );
};

export default SearchBar;
