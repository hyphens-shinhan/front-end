import GroupDetailContent from '@/components/community/group/GroupDetailContent'
import { cn } from '@/utils/cn';

interface GroupDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function GroupDetailPage({ params }: GroupDetailPageProps) {
    const { id } = await params;
    return (
        <div className={styles.container}>
            <GroupDetailContent clubId={id} />
        </div>
    );
}

const styles = {
    container: cn(
        'flex flex-col h-full',
    ),
};