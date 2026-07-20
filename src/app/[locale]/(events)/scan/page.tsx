import { Suspense } from "react";
import ScanTemplate from "@modules/events/scan/template";

const ScanPage = () => {
  return (
    <Suspense>
      <ScanTemplate />
    </Suspense>
  );
};

export default ScanPage;
