"use client";
import { cn } from "@assets/lib/utils";
import IonIcon from "@shared/IonIcon";

type FilterVariant = "primary" | "secondary";

interface SelectedItemsListProps {
  items: { id: string; label: string }[];
  filterVariant?: FilterVariant;
  onRemove: (itemId: string) => void;
}

export const SelectedItemsList: React.FC<SelectedItemsListProps> = ({
  items,
  filterVariant = "primary",
  onRemove,
}) => {
  if (items.length === 0) return null;

  return (
    <section className="flex flex-row flex-wrap gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="relative flex items-center bg-transparent text-neutral-500 border border-neutral-500 rounded-lg px-4 py-2 animate-in fade-in-0 zoom-in-95"
        >
          <p className="label-large-primary">{item.label}</p>
          <button
            onClick={() => onRemove(item.id)}
            className={cn(
              "absolute -top-3 -right-3 bg-primary border-4 rounded-full w-[28px] h-[28px] flex items-center justify-center",
              filterVariant === "secondary"
                ? "border-white"
                : "border-neutral-100",
            )}
          >
            <IonIcon
              name="CloseOutline"
              size="20px"
              className="text-neutral-white"
            />
          </button>
        </div>
      ))}
    </section>
  );
};
