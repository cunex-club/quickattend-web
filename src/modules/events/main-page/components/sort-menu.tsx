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
          className="m-2.5 text-primary cursor-pointer rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <IonIcon
            name="SwapVerticalOutline"
            size="32px"
            className="text-primary"
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
