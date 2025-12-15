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

type FilterVariant = "primary" | "secondary";

interface FilterableListProps {
  title: string;
  items: { id: string; label: string }[];
  selectedItems: Record<string, boolean>; // received selected items from parent
  filterVariant?: FilterVariant;
  onCheckedChange: (itemId: string, checked: boolean) => void;
}

export const FilterableList: React.FC<FilterableListProps> = ({
  title,
  items,
  selectedItems,
  filterVariant = "primary",
  onCheckedChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedItemsArray = items.filter((item) => selectedItems[item.id]);
  const variantClasses = {
    primary: "bg-white",
    secondary: "bg-neutral-100",
  };
  return (
    <div className="flex flex-col space-y-4 w-full">
      <section className=" flex flex-col space-y-2 w-full">
        <div className="flex flex-col w-full">
          <p className="title-large-emphasized">{title}</p>
          <p className="body-small-primary text-neutral-600 ">
            เลือกได้สูงสุด 5 ตัวเลือก
          </p>
        </div>
        <div>
          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="w-full"
          >
            <div className="flex flex-col justify-between mb-2">
              <CollapsibleTrigger asChild>
                <button className="flex justify-between items-center gap-2 px-4 py-2 border border-gray-400 rounded-lg">
                  <p className="body-large-primary text-gray-400">{title}</p>
                  {/* <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" /> */}
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
        </div>
      </section>

      <section className="flex flex-row flex-wrap gap-2 ">
        {selectedItemsArray.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-1.5 bg-transparent text-neutral-500 border border-neutral-500 rounded-lg px-3 py-1.5 animate-in fade-in-0 zoom-in-95"
          >
            <span className="body-small-primary">{item.label}</span>
            <button
              onClick={() => onCheckedChange(item.id, false)}
              className="text-neutral-white bg-red-500 hover:bg-red-600 rounded-full w-5 h-5"
            >
              <p className="translate-y-[1px]">x</p>
            </button>
          </div>
        ))}
      </section>
    </div>
  );
};
