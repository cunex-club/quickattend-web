import EventIdPageTemplate from "@modules/events/event-id/template";

const EventIDPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <EventIdPageTemplate eventId={id} />;
};
export default EventIDPage;
