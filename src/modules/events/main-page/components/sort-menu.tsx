"use client";

import IonIcon from "@shared/IonIcon";
import { cn } from "@assets/lib/utils";
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
  value?: string;
  onSelect: (value: string) => void;
  menuId?: string;
}

const SortMenu = ({ options, value, onSelect, menuId }: SortMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          id={menuId ? `${menuId}-trigger` : undefined}
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
      <DropdownMenuContent
        id={menuId ? `${menuId}-content` : undefined}
        align="end"
        className="py-2"
      >
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onSelect(option.value)}
              className="flex items-center gap-2"
            >
              <IonIcon
                name="Checkmark"
                size="16px"
                className={cn(
                  "text-primary",
                  isSelected ? "opacity-100" : "opacity-0",
                )}
              />
              <div
                className={cn(
                  "body-small-primary",
                  isSelected && "text-primary font-semibold",
                )}
              >
                {option.label}
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortMenu;
