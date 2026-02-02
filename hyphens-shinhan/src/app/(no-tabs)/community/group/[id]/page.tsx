import GroupDetailContent from '@/components/community/group/GroupDetailContent'

interface GroupDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function GroupDetailPage({ params }: GroupDetailPageProps) {
    const { id } = await params;
    return <GroupDetailContent clubId={id} />;
}