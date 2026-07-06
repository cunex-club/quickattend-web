import { CompareView } from "@components/dashboard/template/CompareView";

interface ComparePageProps {
  params: Promise<{ id: string }>;
}

export default async function ComparePage({ params }: ComparePageProps) {
  const { id } = await params;
  return <CompareView eventId={id} />;
}
