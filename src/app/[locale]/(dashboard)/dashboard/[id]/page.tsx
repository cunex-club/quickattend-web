import { OverviewView } from "@components/dashboard/template/OverviewView";

interface OverviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function OverviewPage({ params }: OverviewPageProps) {
  const { id } = await params;
  return <OverviewView eventId={id} />;
}
