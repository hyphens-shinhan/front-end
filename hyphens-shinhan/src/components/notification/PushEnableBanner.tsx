'use client';

import { usePushSubscription } from '@/hooks/usePushSubscription';
import { getUnsupportedReason } from '@/utils/push';
import { cn } from '@/utils/cn';

export default function PushEnableBanner() {
  const { status, subscribe, errorMessage, isSupported, recheckSupport } = usePushSubscription();

  if (!isSupported) {
    const reason = getUnsupportedReason();
    const message =
      reason === 'secure_context'
        ? '푸시 알림은 HTTPS 또는 localhost에서만 사용할 수 있습니다. 주소를 확인해 주세요.'
        : reason === 'service_worker'
          ? '이 브라우저는 서비스 워커를 지원하지 않거나, 보안 연결(HTTPS/localhost)이 필요합니다.'
          : '이 브라우저는 푸시 알림을 지원하지 않습니다.';
    return (
      <div className={cn('mx-4 mt-4 flex flex-col gap-2 rounded-xl bg-grey-1-1 px-4 py-3')}>
        <p className="body-6 text-grey-8">{message}</p>
        <button
          type="button"
          onClick={recheckSupport}
          className={cn(
            'self-start rounded-lg border border-grey-5 bg-white px-3 py-2 text-sm font-medium text-grey-10',
          )}
        >
          다시 확인
        </button>
      </div>
    );
  }

  if (status === 'denied') {
    return (
      <div className={cn('mx-4 mt-4 rounded-xl bg-grey-1-1 px-4 py-3')}>
        <p className="body-6 text-grey-8">알림 권한이 거부되었습니다. 브라우저 설정에서 허용해 주세요.</p>
      </div>
    );
  }

  return (
    <div className={cn('mx-4 mt-4 flex flex-col gap-3 rounded-xl bg-primary-lighter/30 px-4 py-3')}>
      {status === 'subscribed' ? (
        <p className="body-6 text-grey-11">푸시 알림이 켜져 있습니다. 새 소식은 서버에서 알림으로 보내집니다.</p>
      ) : (
        <>
          <p className="body-6 text-grey-11">
            {status === 'loading'
              ? '푸시 알림 지원 여부를 확인하는 중…'
              : '새 소식과 알림을 받으려면 아래 버튼을 누르면 브라우저에서 알림 권한을 묻습니다.'}
          </p>
          <button
            type="button"
            onClick={subscribe}
            disabled={status === 'loading'}
            className={cn(
              'self-start rounded-lg bg-primary-light px-4 py-2 text-sm font-medium text-white',
              'disabled:opacity-50',
            )}
          >
            {status === 'loading' ? '확인 중…' : '알림 켜기'}
          </button>
        </>
      )}
      {errorMessage && (
        <p className="font-caption-caption4 text-red-6">{errorMessage}</p>
      )}
    </div>
  );
}
