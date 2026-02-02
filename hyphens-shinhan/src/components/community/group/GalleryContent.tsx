import Image from "next/image";
import { cn } from "@/utils/cn";
import EmptyContent from "@/components/common/EmptyContent";
import { EMPTY_CONTENT_MESSAGES } from "@/constants";
import type { GalleryImageResponse } from "@/types/clubs";

interface GalleryContentProps {
  /** 갤러리 이미지 목록 */
  images: GalleryImageResponse[];
  /** 소모임 멤버 여부 (비멤버면 앨범 비공개 문구 표시) */
  isMember: boolean;
}

/** 소모임 앨범 컴포넌트 */
export default function GalleryContent({ images, isMember }: GalleryContentProps) {
  if (!isMember) {
    return (
      <EmptyContent
        variant="empty"
        message={EMPTY_CONTENT_MESSAGES.EMPTY.GALLERY_MEMBERS_ONLY}
        className="[&_p]:whitespace-pre-line"
      />
    );
  }

  if (!images.length) {
    return (
      <EmptyContent
        variant="empty"
        message={EMPTY_CONTENT_MESSAGES.EMPTY.GALLERY}
      />
    );
  }

  return (
    <div className={styles.container}>
      {images.map(({ id, image_url }) => (
        <div key={id} className={styles.imageWrapper}>
          <Image
            src={image_url}
            alt="앨범 이미지"
            fill
            className={styles.image}
            sizes="(max-width: 768px) 33vw, 200px"
          />
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: cn("grid grid-cols-3 gap-1.5"),
  imageWrapper: cn("relative w-full aspect-square rounded-[16px] overflow-hidden bg-grey-4"),
  image: cn("object-cover"),
};