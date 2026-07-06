import { DeepInsightView } from "@components/dashboard/template/DeepInsightView";
import { WhitelistInsightView } from "@components/dashboard/template/WhitelistInsightView";

type EventType = "public" | "specific" | "whitelist";

async function getEventData(): Promise<{ type: EventType }> {
  const eventType: EventType = "specific";
  return { type: eventType };
}

interface InsightsPageProps {
  params: Promise<{ id: string }>;
}

export default async function InsightsPageController({
  params,
}: InsightsPageProps) {
  await params;
  const event = await getEventData();
  if (event.type === "whitelist") {
    return <WhitelistInsightView />;
  }
  return <DeepInsightView />;
}
