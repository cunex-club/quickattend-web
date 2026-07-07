"use client";
import { useState } from "react";
import { ScrollArea } from "@assets/components/ui/scroll-area";
import { Checkbox } from "@assets/components/ui/checkbox";
import { Label } from "@assets/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@assets/components/ui/collapsible";
import { cn } from "@assets/lib/utils";
import IonIcon from "@shared/IonIcon";

type FilterVariant = "primary" | "secondary";

interface FilterDropdownProps {
  title: string;
  items: { id: string; label: string }[];
  selectedItems: Record<string, boolean>;
  filterVariant?: FilterVariant;
  onCheckedChange: (itemId: string, checked: boolean) => void;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  title,
  items,
  selectedItems,
  filterVariant = "primary",
  onCheckedChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const variantClasses = {
    primary: "bg-white",
    secondary: "bg-neutral-100",
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <div className="flex flex-col justify-between mb-2">
        <CollapsibleTrigger asChild>
          <button className="flex justify-between items-center gap-2 px-4 py-2 border border-gray-400 rounded-lg cursor-pointer">
            <p className="body-large-primary text-gray-400">{title}</p>
            <IonIcon
              name={isOpen ? "ChevronUpOutline" : "ChevronDownOutline"}
              size="18px"
              className="text-primary"
            />
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent
          className="overflow-hidden 
         data-[state=closed]:animate-collapsible-up 
         data-[state=open]:animate-collapsible-down"
        >
          <ScrollArea
            className={cn(
              "h-72 sm:h-80 md:h-96 w-full rounded-md p-4",
              variantClasses[filterVariant],
            )}
          >
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-center space-x-4 border-b border-neutral-200 p-2 md:p-4",
                    filterVariant === "secondary" && "border-gray-300",
                  )}
                >
                  <Checkbox
                    id={item.id}
                    checked={!!selectedItems[item.id]}
                    onCheckedChange={(checked) =>
                      onCheckedChange(item.id, checked as boolean)
                    }
                    className="cursor-pointer"
                  />
                  <Label htmlFor={item.id}>
                    <p className="body-large-primary">{item.label}</p>
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
