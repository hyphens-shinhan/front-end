'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import jsQR from 'jsqr';
import { cn } from '@/utils/cn';
import { Icon } from '../common/Icon';
import shinhanCharacter from '@/assets/character.png';
import Image from 'next/image';

const SCAN_VIDEO_SIZE = 242;

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** QR에 담을 URL (예: 프로필 공유 링크) */
  qrValue: string;
}

/** 퍼블릭 프로필 URL에서 userId 추출 (예: https://.../mypage/abc123 → abc123) */
function getUserIdFromProfileUrl(urlString: string): string | null {
  try {
    const url = new URL(urlString);
    const match = url.pathname.match(/^\/mypage\/([^/]+)$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/** Figma 디자인 기준 QR 코드 모달 (중앙 카드) + 스캔 모드 */
export default function QRCodeModal({
  isOpen,
  onClose,
  qrValue,
}: QRCodeModalProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'qr' | 'scan'>('qr');
  const [scanError, setScanError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanLoopRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (viewMode === 'scan') {
          setViewMode('qr');
          setScanError(null);
        } else {
          onClose();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, viewMode]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // 모달 닫을 때 스캔 모드/스트림 정리
  useEffect(() => {
    if (!isOpen) {
      setViewMode('qr');
      setScanError(null);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (scanLoopRef.current != null) {
        cancelAnimationFrame(scanLoopRef.current);
        scanLoopRef.current = null;
      }
    }
  }, [isOpen]);

  // 스캔 모드: 카메라 켜고 QR 디코딩 루프
  useEffect(() => {
    if (!isOpen || viewMode !== 'scan') return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    setScanError(null);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      const isSecureContext = typeof window !== 'undefined' && window.isSecureContext;
      setScanError(
        isSecureContext
          ? '이 브라우저에서는 카메라를 지원하지 않거나 접근이 차단되어 있어요.'
          : '카메라는 HTTPS에서만 사용할 수 있어요. (로컬에서는 ngrok 등 HTTPS 터널 사용)',
      );
      return;
    }

    let cancelled = false;

    function setMediaError(err: unknown) {
      const e = err as { name?: string };
      if (e?.name === 'NotAllowedError' || e?.name === 'PermissionDeniedError') {
        setScanError('카메라 권한을 허용해 주세요.');
      } else if (e?.name === 'NotFoundError') {
        setScanError('카메라를 찾을 수 없습니다.');
      } else if (e?.name === 'SecurityError' || e?.name === 'NotSupportedError') {
        setScanError('카메라는 HTTPS에서만 사용할 수 있어요.');
      } else {
        setScanError('카메라를 사용할 수 없습니다.');
      }
    }

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } } })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        video.srcObject = stream;
        video.setAttribute('playsinline', 'true');
        video.play().then(() => {
          if (cancelled) return;
          canvas.width = SCAN_VIDEO_SIZE;
          canvas.height = SCAN_VIDEO_SIZE;

          function tick() {
            const v = videoRef.current;
            const c = canvasRef.current?.getContext('2d');
            if (cancelled || !streamRef.current || !v || !c) return;
            if (v.readyState === v.HAVE_ENOUGH_DATA) {
              c.drawImage(v, 0, 0, SCAN_VIDEO_SIZE, SCAN_VIDEO_SIZE);
              const imageData = c.getImageData(0, 0, SCAN_VIDEO_SIZE, SCAN_VIDEO_SIZE);
              const code = jsQR(imageData.data, imageData.width, imageData.height);
              if (code?.data) {
                const userId = getUserIdFromProfileUrl(code.data);
                if (userId) {
                  stream.getTracks().forEach((t) => t.stop());
                  streamRef.current = null;
                  if (scanLoopRef.current != null) cancelAnimationFrame(scanLoopRef.current);
                  onClose();
                  router.push(`/mypage/${userId}`);
                  return;
                }
              }
            }
            scanLoopRef.current = requestAnimationFrame(tick);
          }
          scanLoopRef.current = requestAnimationFrame(tick);
        }).catch(setMediaError);
      })
      .catch(setMediaError);

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (scanLoopRef.current != null) {
        cancelAnimationFrame(scanLoopRef.current);
        scanLoopRef.current = null;
      }
    };
  }, [isOpen, viewMode, onClose, router]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      if (viewMode === 'scan') setViewMode('qr');
      else onClose();
    }
  };

  const handleClose = () => {
    if (viewMode === 'scan') {
      setViewMode('qr');
      setScanError(null);
    } else {
      onClose();
    }
  };

  const modalContent = (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={viewMode === 'scan' ? 'QR 코드 스캔' : 'QR 코드'}
    >
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {viewMode === 'scan' ? 'QR 코드 스캔' : 'QR 코드'}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className={styles.closeButton}
            aria-label="닫기"
          >
            <Icon name="IconLLineClose" size={20} />
          </button>
        </div>

        {/** QR 보기 vs 카메라 스캔 (같은 자리) */}
        <div className={styles.qrWrapper}>
          {viewMode === 'qr' ? (
            <>
              <QRCodeSVG
                value={qrValue}
                size={172}
                level="M"
                className={styles.qrSvg}
                fgColor="#0046FF"
                bgColor="#FFFFFF"
              />
              <div className={styles.centerImageWrapper}>
                <Image
                  src={shinhanCharacter}
                  alt="신한 캐릭터"
                  className={styles.centerImage}
                />
              </div>
            </>
          ) : (
            <>
              <video
                ref={videoRef}
                className={styles.scanVideo}
                muted
                playsInline
              />
              <canvas ref={canvasRef} className="absolute w-0 h-0 overflow-hidden" aria-hidden />
              {scanError && (
                <p className={styles.scanError}>{scanError}</p>
              )}
            </>
          )}
        </div>

        <p className={styles.caption}>
          {viewMode === 'scan'
            ? '다른 사람의 QR 코드를 화면에 맞춰 주세요'
            : '프로필 정보를 보려면 이 QR 코드를 스캔하세요'}
        </p>

        <div className={styles.buttons}>
          {viewMode === 'scan' ? (
            <button
              type="button"
              className={styles.scanButton}
              onClick={() => { setViewMode('qr'); setScanError(null); }}
            >
              QR 코드 보기
            </button>
          ) : (
            <>
              <button type="button" className={styles.downloadButton} onClick={onClose}>
                QR 코드 다운로드
              </button>
              <button
                type="button"
                className={styles.scanButton}
                onClick={() => setViewMode('scan')}
              >
                QR 코드 스캔
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

const styles = {
  overlay: cn(
    'fixed inset-0 z-50 flex items-center justify-center',
    'bg-black/50',
  ),
  card: cn(
    'w-[294px] bg-white rounded-[20px] p-6 shadow-lg',
  ),
  header: cn(
    'flex items-center justify-between mb-5',
  ),
  title: cn(
    'body-3 text-grey-11 leading-tight',
  ),
  closeButton: cn(
    'p-0.5 rounded hover:bg-grey-3 transition-colors',
  ),
  qrWrapper: cn(
    'relative flex items-center justify-center overflow-hidden rounded-[9px]',
    'w-[242px] h-[220px] mx-auto mb-4',
  ),
  qrSvg: cn(
    'rounded-[9px]',
  ),
  centerImageWrapper: cn(
    'absolute inset-0 flex items-center justify-center pointer-events-none rounded-full',
  ),
  centerImage: cn(
    'w-16 h-16 p-2 rounded-full bg-white object-cover border border-grey-2',
  ),
  scanVideo: cn(
    'w-full h-full object-cover rounded-[9px]',
  ),
  scanError: cn(
    'absolute inset-0 flex items-center justify-center text-center body-10 text-grey-7 px-4',
  ),
  caption: cn(
    'body-10 text-grey-11 text-center leading-normal my-4',
  ),
  buttons: cn(
    'flex gap-2',
  ),
  downloadButton: cn(
    'flex-1 py-3 rounded-[12px] border border-grey-2',
    'font-caption-caption3 text-grey-11',
  ),
  scanButton: cn(
    'flex-1 py-3 rounded-[12px] bg-primary-shinhanblue',
    'font-caption-caption3 text-white',
  ),
};
