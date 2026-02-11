'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { toPng } from 'html-to-image';
import jsQR from 'jsqr';
import Image from 'next/image';
import { cn } from '@/utils/cn';
import Button from '../common/Button';
import shinhanCharacter from '@/assets/character.png';

const SCAN_VIDEO_SIZE = 242;

/** 퍼블릭 프로필 URL에서 userId 추출 */
function getUserIdFromProfileUrl(urlString: string): string | null {
  try {
    const url = new URL(urlString);
    const match = url.pathname.match(/^\/mypage\/([^/]+)$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export interface QRInlineContentProps {
  /** QR에 담을 URL (프로필 공유 링크) */
  profileShareUrl: string;
  /** 스캔 성공 시 (userId) */
  onScanSuccess: (userId: string) => void;
  /** 패널이 보이는 동안 true. false가 되면 카메라 정리 */
  isActive?: boolean;
}

function QRInlineContent({
  profileShareUrl,
  onScanSuccess,
  isActive = true,
}: QRInlineContentProps) {
  const [viewMode, setViewMode] = useState<'qr' | 'scan'>('qr');
  const [scanError, setScanError] = useState<string | null>(null);

  const qrDownloadWrapRef = useRef<HTMLDivElement>(null);
  const cardForDownloadRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanLoopRef = useRef<number | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (scanLoopRef.current != null) {
      cancelAnimationFrame(scanLoopRef.current);
      scanLoopRef.current = null;
    }
  }, []);

  const switchToScan = useCallback(() => {
    setScanError(null);
    setViewMode('scan');
  }, []);

  const switchToQR = useCallback(() => {
    stopCamera();
    setScanError(null);
    setViewMode('qr');
  }, [stopCamera]);

  // 패널 비활성화(닫힘) 시 카메라 정리
  useEffect(() => {
    if (!isActive) stopCamera();
  }, [isActive, stopCamera]);

  // 스캔 모드: 카메라 켜고 QR 디코딩 루프
  useEffect(() => {
    if (!isActive || viewMode !== 'scan') return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    setScanError(null);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      const isSecureContext =
        typeof window !== 'undefined' && window.isSecureContext;
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
      } else if (
        e?.name === 'SecurityError' ||
        e?.name === 'NotSupportedError'
      ) {
        setScanError('카메라는 HTTPS에서만 사용할 수 있어요.');
      } else {
        setScanError('카메라를 사용할 수 없습니다.');
      }
    }

    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        video.srcObject = stream;
        video.setAttribute('playsinline', 'true');
        video
          .play()
          .then(() => {
            if (cancelled) return;
            canvas.width = SCAN_VIDEO_SIZE;
            canvas.height = SCAN_VIDEO_SIZE;

            function tick() {
              const v = videoRef.current;
              const c = canvasRef.current?.getContext('2d');
              if (cancelled || !streamRef.current || !v || !c) return;
              if (v.readyState === v.HAVE_ENOUGH_DATA) {
                c.drawImage(v, 0, 0, SCAN_VIDEO_SIZE, SCAN_VIDEO_SIZE);
                const imageData = c.getImageData(
                  0,
                  0,
                  SCAN_VIDEO_SIZE,
                  SCAN_VIDEO_SIZE,
                );
                const code = jsQR(
                  imageData.data,
                  imageData.width,
                  imageData.height,
                );
                if (code?.data) {
                  const userId = getUserIdFromProfileUrl(code.data);
                  if (userId) {
                    stream.getTracks().forEach((t) => t.stop());
                    streamRef.current = null;
                    if (scanLoopRef.current != null)
                      cancelAnimationFrame(scanLoopRef.current);
                    onScanSuccess(userId);
                    return;
                  }
                }
              }
              scanLoopRef.current = requestAnimationFrame(tick);
            }
            scanLoopRef.current = requestAnimationFrame(tick);
          })
          .catch(setMediaError);
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
  }, [isActive, viewMode, onScanSuccess]);

  const handleDownloadQR = useCallback(async () => {
    const node = cardForDownloadRef.current;
    if (!node || !profileShareUrl) return;
    try {
      const dataUrl = await toPng(node, {
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        cacheBust: true,
      });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'qr-code-card.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      const qrCanvas =
        qrDownloadWrapRef.current?.querySelector<HTMLCanvasElement>('canvas');
      if (qrCanvas) {
        const a = document.createElement('a');
        a.href = qrCanvas.toDataURL('image/png');
        a.download = 'qr-code.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }
  }, [profileShareUrl]);

  return (
    <>
      {/* 타이틀 + 구분선 */}
      <div className={styles.qrTitleRow}>
        <span className={styles.qrTitleText}>
          {viewMode === 'scan' ? 'QR코드 스캔' : '내 QR코드'}
        </span>
        <div className={styles.qrTitleDivider} />
      </div>

      {/* QR 코드 / 카메라 스캔 영역 */}
      <div className={styles.qrContentWrapper}>
        <div className={styles.qrImageContainer}>
          {viewMode === 'qr' ? (
            <>
              <QRCodeSVG
                value={profileShareUrl}
                size={235}
                level="M"
                className="rounded-lg"
                fgColor="#0046FF"
                bgColor="#FFFFFF"
              />
              <div
                ref={qrDownloadWrapRef}
                className={styles.hiddenEl}
                aria-hidden
              >
                <QRCodeCanvas
                  value={profileShareUrl}
                  size={256}
                  level="M"
                  fgColor="#0046FF"
                  bgColor="#FFFFFF"
                />
              </div>
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
              <canvas
                ref={canvasRef}
                className="absolute w-0 h-0 overflow-hidden"
                aria-hidden
              />
              {scanError && (
                <div className={styles.scanErrorOverlay}>
                  <p className={styles.scanErrorText}>{scanError}</p>
                </div>
              )}
            </>
          )}
        </div>
        <p className={styles.qrCaption}>
          {viewMode === 'scan'
            ? '다른 사람의 QR 코드를 화면에 맞춰 주세요'
            : 'QR코드를 스캔해 친구가 되어보세요!'}
        </p>
      </div>

      {/* 다운로드용 카드 (숨김) */}
      <div className={styles.hiddenEl} aria-hidden>
        <div
          ref={cardForDownloadRef}
          className="w-[294px] bg-white rounded-[20px] p-6"
        >
          <h2 className="body-3 text-grey-11 mb-5">QR 코드</h2>
          <div className="flex items-center justify-center w-[242px] h-[220px] mx-auto mb-4">
            <QRCodeSVG
              value={profileShareUrl}
              size={172}
              level="M"
              fgColor="#0046FF"
              bgColor="#FFFFFF"
            />
          </div>
          <p className="body-10 text-grey-11 text-center">
            프로필 정보를 보려면 이 QR 코드를 스캔하세요
          </p>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className={styles.qrButtons}>
        {viewMode === 'scan' ? (
          <Button
            type="secondary"
            size="L"
            label="QR코드 보기"
            onClick={switchToQR}
          />
        ) : (
          <>
            <Button
              type="secondary"
              size="L"
              label="QR코드 다운로드"
              onClick={handleDownloadQR}
            />
            <Button
              type="primary"
              size="L"
              label="QR코드 스캔"
              onClick={switchToScan}
            />
          </>
        )}
      </div>
    </>
  );
}

export default memo(QRInlineContent);

const styles = {
  qrTitleRow: cn('flex items-center gap-4 mt-6 mb-2 px-1'),
  qrTitleText: cn('title-18 text-grey-11 shrink-0'),
  qrTitleDivider: cn('flex-1 h-px bg-[#C5E1FF]'),
  qrContentWrapper: cn('flex flex-col items-center gap-9 mt-12'),
  qrImageContainer: cn(
    'relative flex items-center justify-center rounded-lg',
    'w-[235px] h-[235px]',
  ),
  centerImageWrapper: cn(
    'absolute inset-0 flex items-center justify-center pointer-events-none',
  ),
  centerImage: cn(
    'w-16 h-16 p-2 rounded-full bg-white object-cover border border-grey-2',
  ),
  scanVideo: cn('w-full h-full object-cover rounded-lg'),
  scanErrorOverlay: cn(
    'absolute inset-0 flex items-center justify-center',
  ),
  scanErrorText: cn('body-10 text-grey-9 text-center px-4'),
  qrCaption: cn('body-7 text-grey-9 text-center'),
  qrButtons: cn('flex flex-col gap-2 mt-8 px-1'),
  hiddenEl: cn('fixed left-0 top-0 z-[-1] opacity-0 pointer-events-none'),
};
