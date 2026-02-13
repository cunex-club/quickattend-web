import { DeepInsightView } from "@components/dashboard/templete/DeepInsightView";
import { WhitelistInsightView } from "@components/dashboard/templete/WhitelistInsightView";

// --- mock data ---
type EventType = "public" | "specific" | "whitelist";

async function getEventData(): Promise<{ type: EventType }> {
  const eventType: EventType = "specific";
  // const eventType: EventType = "whitelist";
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
