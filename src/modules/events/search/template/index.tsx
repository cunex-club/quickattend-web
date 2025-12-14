"use client";

import SearchBar from "@shared/search-bar";
import Icon from "@shared/Icon";

const EventSearchTemplate = () => {
  return (
    <div className="w-full">
      <div className="px-12 pt-20">
        <SearchBar
          placeholder="Search events..."
          onsearch={(query) => console.log(query)}
        />
      </div>
      <div className="flex flex-col justify-center items-center space-y-">
        <div className="p-6">
          <Icon name="search" size={216} className="text-primary" />
        </div>
        <div className="title-large-primary">กำลังค้นหากิจกรรมที่ต้องการ</div>
      </div>
    </div>
  );
};
export default EventSearchTemplate;
