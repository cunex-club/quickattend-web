"use client";

import { useTranslations } from "next-intl";
import { useSidebar } from "../../../../../context/SidebarContext";
import { useEffect, useState } from "react";

const EventEditTemplate = () => {
  const { setShowSidebar } = useSidebar();
  const tEditEvent = useTranslations("EditEvent");

  const [width, setWidth] = useState(0);

  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    setShowSidebar(false);
    return () => setShowSidebar(true);
  }, [setShowSidebar]);

  return <div className="w-full">This is Event Edit Page</div>;
};

export default EventEditTemplate;
