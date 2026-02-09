import NotificationListContent from '@/components/notification/NotificationListContent';
import { MOCK_NOTIFICATIONS } from '@/data/mock-notifications';
import { cn } from '@/utils/cn';

export default function NotificationPage() {
    return (
        <div className={styles.container}>
            <NotificationListContent items={MOCK_NOTIFICATIONS} />
        </div>
    );
}

const styles = {
    container: cn(
        'flex flex-col',
        'pb-8',
    ),
};
