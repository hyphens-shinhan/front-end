'use client';

import EmptyContent from '@/components/common/EmptyContent';
import NotificationListContent from '@/components/notification/NotificationListContent';
import PushEnableBanner from '@/components/notification/PushEnableBanner';
import { EMPTY_CONTENT_MESSAGES } from '@/constants';
import { useNotifications } from '@/hooks/notification';
import { cn } from '@/utils/cn';
import { mapNotificationToItem } from '@/utils/notification';

export default function NotificationPage() {
    const { data, isLoading, isError } = useNotifications({ limit: 50 });

    const items = data?.notifications.map(mapNotificationToItem) ?? [];

    if (isLoading) {
        return (
            <div className={cn(styles.container, 'min-h-[40vh]')}>
                <PushEnableBanner />
                <EmptyContent variant="loading" message={EMPTY_CONTENT_MESSAGES.LOADING.DEFAULT} />
            </div>
        );
    }

    if (isError) {
        return (
            <div className={cn(styles.container, 'min-h-[40vh]')}>
                <PushEnableBanner />
                <EmptyContent variant="error" message={EMPTY_CONTENT_MESSAGES.ERROR.LIST} />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className={cn(styles.container, 'min-h-[40vh]')}>
                <PushEnableBanner />
                <EmptyContent variant="empty" message="알림이 없어요." />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <PushEnableBanner />
            <NotificationListContent items={items} />
        </div>
    );
}

const styles = {
    container: cn('flex flex-col min-h-[40vh] pb-8'),
};
