import { memo } from "react";
import { cn } from "@/utils/cn";
import { Icon } from "@/components/common/Icon";
import InfoTag from "@/components/common/InfoTag";
import Avatar from "@/components/common/Avatar";
import type { ClubResponse, ClubCategory } from "@/types/clubs";

const CATEGORY_LABEL: Record<ClubCategory, string> = {
  GLOBAL: '글로벌',
  VOLUNTEER: '봉사',
  STUDY: '스터디',
};

interface GroupCardProps {
  /** 소모임(동아리) 데이터 */
  club: ClubResponse;
  /** 카드(목록): 멤버 미리보기 표시 / 상세: 멤버 미리보기 숨김 */
  variant?: 'card' | 'detail';
}

/** 소모임 모집글 카드 컴포넌트 동일성 비교 함수 */
function areGroupCardPropsEqual(prev: GroupCardProps, next: GroupCardProps): boolean {
  const a = prev.club;
  const b = next.club;
  if (prev.variant !== next.variant) return false;
  if (a.id !== b.id) return false;
  if (a.name !== b.name) return false;
  if (a.description !== b.description) return false;
  if (a.category !== b.category) return false;
  if (a.is_member !== b.is_member) return false;
  if (a.member_count !== b.member_count) return false;
  const aImgs = a.recent_member_images ?? [];
  const bImgs = b.recent_member_images ?? [];
  if (aImgs.length !== bImgs.length) return false;
  if (aImgs.some((url, i) => url !== bImgs[i])) return false;
  return true;
}

/** 소모임 모집글 카드 컴포넌트 (목록·상세 공통)
 * @example
 * <GroupCard club={clubData} />
 * <GroupCard club={clubData} variant="detail" />
 */
function GroupCard({ club, variant = 'card' }: GroupCardProps) {
  const {
    name,
    description,
    category,
    is_member,
    member_count,
    recent_member_images,
  } = club;

  const isCard = variant === 'card';
  const previewImages = recent_member_images?.slice(0, 2) ?? [];
  const slot1 = previewImages[0];
  const slot2 = previewImages[1];

  return (
    <div className={cn(styles.container, !isCard && styles.containerCard)}>
      {/** 태그들 */}
      <div className={styles.tagContainer}>
        {is_member && <InfoTag label="현재 참여 중" color="blue" />}
        <InfoTag label={CATEGORY_LABEL[category]} color="grey" />
      </div>
      <div className={styles.contentWrapper}>
        {/** 제목, 로고, 본문 내용 */}
        <div className={styles.contentContainer}>
          <div className={styles.titleContainer}>
            <p className={cn(styles.title, isCard && styles.titleCard)}>{name}</p>
            {/** TODO: 인기 소모임인지 여부에 따라 아이콘 표시 */}
            <span className={styles.iconWrapper}>
              <Icon name="IconMVectorFire" size={20} />
            </span>
          </div>
          <p className={cn(styles.content, isCard && styles.contentCard)}>{description}</p>
        </div>
        {/** 소모임 멤버 미리보기: 카드일 때만 표시 (동그라미 3개) */}
        {isCard && (
          <div className={styles.memberPreviewContainer}>
            <div className={styles.memberPreviewItem}>
              <Avatar
                src={slot1}
                alt="멤버 프로필"
                fill
                containerClassName="w-10 h-10"
              />
            </div>
            <div className={styles.memberPreviewItem}>
              <Avatar
                src={slot2}
                alt="멤버 프로필"
                fill
                containerClassName="w-10 h-10"
              />
            </div>
            <div className={styles.memberCountItem}>+{member_count}</div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: cn(
    'flex flex-col gap-4',
    'px-4 py-5'
  ),
  containerCard: cn('gap-3 px-0'),
  tagContainer: cn(
    'flex gap-1.5',
  ),
  contentWrapper: cn(
    'flex gap-8 justify-between',
  ),
  contentContainer: cn(
    'flex flex-col gap-3',
  ),
  titleContainer: cn(
    'flex items-center gap-1 pr-4',
  ),
  title: cn('title-18 text-grey-11 min-w-0'),
  titleCard: cn('line-clamp-1'),
  iconWrapper: cn('shrink-0'),
  content: cn('body-8 text-grey-11'),
  contentCard: cn('line-clamp-2'),
  memberPreviewContainer: cn(
    'flex flex-col -space-y-6.5',
  ),
  memberPreviewItem: cn(
    'relative w-10 h-10 rounded-full bg-grey-3 overflow-hidden',
    'z-0',
  ),
  memberCountItem: cn(
    'relative w-10 h-10 rounded-full bg-primary-secondaryroyal',
    'flex items-center justify-center',
    'font-caption-caption1 text-grey-2',
    'z-10',
  ),
};

export default memo(GroupCard, areGroupCardPropsEqual);
