import { Checkbox } from "@assets/components/ui/checkbox";
import { Label } from "@assets/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@assets/components/ui/popover";
import IonIcon from "@shared/IonIcon";
import { cn } from "@assets/lib/utils";
import type { TableFilterPopoverProps } from "@customTypes/registration";

export const TableFilterPopover = ({
  options,
  selectedValues,
  onChange,
  displayLabelMap,
  className,
  children,
}: TableFilterPopoverProps) => {
  const isActive = selectedValues.length > 0;

  const handleToggle = (value: string, checked: boolean) => {
    const next = checked
      ? [...selectedValues, value]
      : selectedValues.filter((v) => v !== value);
    onChange(next);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <th
          className={cn(
            "px-4 py-3 whitespace-nowrap cursor-pointer hover:bg-white/10 transition-colors",
            className,
          )}
        >
          <div className="flex flex-row items-center justify-between gap-2 label-large-emphasized w-full">
            <p className="label-large-emphasized">{children}</p>
            <div className="relative">
              <IonIcon name="FilterOutline" size="18px" />
              <div
                className={cn(
                  "absolute -top-0.5 -right-0.5 w-2 h-2 bg-error rounded-full transition-all duration-300 ease-in-out",
                  isActive ? "opacity-100 scale-100" : "opacity-0 scale-0",
                )}
              />
            </div>
          </div>
        </th>
      </PopoverTrigger>
      <PopoverContent className="w-64 py-6 pl-6 pr-2" align="start">
        <div className="h-auto max-h-64 w-full rounded-md overflow-y-auto">
          <div className="flex flex-col h-auto space-y-4">
            {options.map((opt) => (
              <div key={opt} className="flex items-center space-x-3 p-1">
                <Checkbox
                  id={`filter-${opt}`}
                  checked={selectedValues.includes(opt)}
                  onCheckedChange={(checked) =>
                    handleToggle(opt, checked as boolean)
                  }
                  className="cursor-pointer"
                />
                <Label htmlFor={`filter-${opt}`} className="cursor-pointer">
                  <p className="body-large-primary">
                    {displayLabelMap?.[opt] ?? opt}
                  </p>
                </Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
