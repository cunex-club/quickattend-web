"use client";

import { useEffect } from "react";
import { useSidebar } from "../../../../../context/SidebarContext";

const EventCreatePage = () => {
  const { setShowSidebar } = useSidebar();

  useEffect(() => {
    setShowSidebar(false);
    return () => setShowSidebar(true);
  }, [setShowSidebar]);

  return <div>This is Create Event Page</div>;
};

export default EventCreatePage;
