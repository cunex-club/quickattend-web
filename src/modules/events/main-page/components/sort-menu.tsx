"use client";

import IonIcon from "@shared/IonIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@assets/components/ui/dropdown-menu";

export type SortOption = {
  label: string;
  value: string;
};

interface SortMenuProps {
  options: SortOption[];
  onSelect: (value: string) => void;
}

const SortMenu = ({ options, onSelect }: SortMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Sort"
          className="p-1 text-primary cursor-pointer rounded focus:outline-none focus:ring-2 focus:ring-primary/50 [&>div]:!p-0"
        >
          <IonIcon
            name="SwapVerticalOutline"
            className="text-primary w-6 h-6 lg:w-8 lg:h-8"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="py-2">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onSelect(option.value)}
          >
            <div className="body-small-primary">{option.label}</div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortMenu;
