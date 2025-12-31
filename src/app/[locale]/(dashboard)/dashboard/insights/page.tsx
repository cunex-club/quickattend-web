import React from "react";
import { DeepInsightView } from "@components/dashboard/DeepInsightView";
import { WhitelistInsightView } from "@components/dashboard/WhitelistInsightView";

// --- mock data ---
type EventType = "public" | "specific" | "whitelist";

async function getEventData(): Promise<{ type: EventType }> {
  const eventType: EventType = "whitelist";
  return { type: eventType };
}
// -------------------------------

export default async function InsightsPageController() {
  const event = await getEventData();
  if (event.type === "whitelist") {
    return <WhitelistInsightView />;
  }
  return <DeepInsightView />;
}