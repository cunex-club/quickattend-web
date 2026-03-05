"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@assets/components/ui/avatar";

const Header = () => {
  return (
    <div className="flex justify-between items-center bg-neutral-200 px-5 py-4 w-full">
      <div className="headline-small-emphasized text-neutral-600">
        QuickAttend
      </div>
      <Avatar className="w-10 h-10">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default Header;
