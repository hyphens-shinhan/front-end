'use client';

import { useToastStore } from '@/stores/useToastStore';
import Toast from './Toast';

/**
 * 전역 토스트 컨테이너.
 * layout.tsx에 한 번만 마운트하고, useToast() 훅으로 어디서든 토스트를 띄울 수 있습니다.
 */
export default function ToastContainer() {
  const isOpen = useToastStore((s) => s.isOpen);
  const message = useToastStore((s) => s.message);
  const position = useToastStore((s) => s.position);
  const showIcon = useToastStore((s) => s.showIcon);
  const variant = useToastStore((s) => s.variant);

  if (!isOpen) return null;

  return (
    <Toast
      message={message}
      position={position}
      showIcon={showIcon}
      variant={variant}
    />
  );
}
