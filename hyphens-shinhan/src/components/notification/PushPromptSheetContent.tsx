'use client';

import { usePushSubscription } from '@/hooks/usePushSubscription';
import { useCenterModalStore } from '@/stores';
import { cn } from '@/utils/cn';

const PUSH_PROMPT_DISMISSED_KEY = 'pushPromptDismissed';

/** 중앙 모달 안에서 쓰는 알림 켜기/나중에 버튼 영역 */
export default function PushPromptSheetContent() {
  const { status, subscribe, errorMessage, isSupported } = usePushSubscription();
  const onClose = useCenterModalStore((s) => s.onClose);

  const handleEnable = async () => {
    await subscribe();
    onClose();
  };

  const handleLater = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(PUSH_PROMPT_DISMISSED_KEY, '1');
    }
    onClose();
  };

  if (!isSupported) return null;

  const isLoading = status === 'loading';
  const isSubscribed = status === 'subscribed';

  return (
    <div className="flex flex-col gap-4">
      <p className="body-6 text-grey-8">
        새 소식과 중요한 알림을 받으려면 알림을 켜 주세요.
      </p>
      {errorMessage && (
        <p className="font-caption-caption4 text-red-6">{errorMessage}</p>
      )}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={handleEnable}
          disabled={isLoading || isSubscribed}
          className={cn(
            'w-full rounded-xl bg-primary-light px-4 py-3 text-sm font-medium text-white',
            'disabled:opacity-50',
          )}
        >
          {isLoading ? '확인 중…' : isSubscribed ? '알림 켜짐' : '알림 켜기'}
        </button>
        <button
          type="button"
          onClick={handleLater}
          className="body-6 text-grey-8 py-2"
        >
          나중에
        </button>
      </div>
    </div>
  );
}

export { PUSH_PROMPT_DISMISSED_KEY };
