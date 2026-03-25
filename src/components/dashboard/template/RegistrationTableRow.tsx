import { useState } from "react";
import type { RegistrationItem } from "@customTypes/registration";
import { StatusBadge } from "@components/StatusBadge";
import { cn } from "@assets/lib/utils";

interface Props {
  item: RegistrationItem;
  index: number;
}

export const RegistrationTableRow = ({ item, index }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <tr
      className={`border-b border-gray-100 hover:bg-gray-50 title-medium-primary text-neutral-500 transition-colors ${
        index % 2 === 0 ? "bg-neutral-white" : "bg-neutral-100"
      }`}
    >
      <td className="whitespace-nowrap align-top text-center w-20 py-3">
        {item.avatar && (
          <img
            src={item.avatar}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover border border-gray-200 inline-block"
          />
        )}
      </td>
      <td className="px-4 py-3 whitespace-nowrap align-top translate-y-2.5">
        {item.name}
      </td>
      <td className="px-4 py-3 whitespace-nowrap min-w-32 align-top translate-y-2.5">
        {item.id}
      </td>
      <td className="px-4 py-3 whitespace-nowrap min-w-20 w-20 align-top translate-y-2.5">
        {item.type}
      </td>
      <td
        className={cn(
          "px-4 py-3 whitespace-nowrap min-w-48 w-48 max-w-48 truncate align-top translate-y-2.5",
          isExpanded ? "whitespace-normal break-words" : "truncate",
        )}
        title={item.faculty}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {item.faculty}
      </td>
      <td className="px-4 py-3 whitespace-nowrap min-w-24 align-top translate-y-2.5">
        {item.time}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-center align-top">
        <StatusBadge status={item.status} />
      </td>
      <td
        className={cn(
          "px-4 py-3 min-w-xl max-w-xl cursor-pointer transition-all duration-300 align-middle",
          isExpanded ? "whitespace-normal break-words" : "truncate",
        )}
        title={item.remark}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {item.remark}
      </td>
    </tr>
  );
};
