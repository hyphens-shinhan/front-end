import EventDetailContent from "@/components/community/shinhan-notice/EventDetailContent";

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;

  return <EventDetailContent eventId={id} />;
}
