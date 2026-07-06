"use client";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { FilterDropdown } from "./FilterDropdown";
import { SelectedItemsList } from "./SelectedItemsList";

type FilterVariant = "primary" | "secondary";

interface FilterableListProps {
  title: string;
  items: { id: string; label: string }[];
  selectedItems: Record<string, boolean>; // received selected items from parent
  filterVariant?: FilterVariant;
  hasDescription?: boolean;
  onCheckedChange: (itemId: string, checked: boolean) => void;
}

export const FilterableList: React.FC<FilterableListProps> = ({
  title,
  items,
  selectedItems,
  filterVariant = "primary",
  hasDescription = false,
  onCheckedChange,
}) => {
  const t = useTranslations("Dashboard.compare");
  // Memoize derived state to avoid unnecessary recalculations
  const selectedItemsArray = useMemo(
    () => items.filter((item) => selectedItems[item.id]),
    [items, selectedItems],
  );

  const handleRemoveItem = (itemId: string) => {
    onCheckedChange(itemId, false);
  };

  return (
    <div className="flex flex-col space-y-4 w-full">
      <section className="flex flex-col space-y-2 w-full">
        <div className="flex flex-col w-full">
          <p className="title-large-emphasized">{title}</p>
          {hasDescription && (
            <p className="body-small-primary text-neutral-600 py-2">
              {t("maxSelectionError")}
            </p>
          )}
        </div>
        <div>
          <FilterDropdown
            title={title}
            items={items}
            selectedItems={selectedItems}
            filterVariant={filterVariant}
            onCheckedChange={onCheckedChange}
          />
        </div>
      </section>

      <SelectedItemsList
        items={selectedItemsArray}
        filterVariant={filterVariant}
        onRemove={handleRemoveItem}
      />
    </div>
  );
};
