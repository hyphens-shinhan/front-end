'use client';

import { cn } from "@/utils/cn";
import { Icon } from "../common/Icon";
import { useBottomSheetStore } from "@/stores";

type MoreMenuType = 'post' | 'comment';

const EDIT_DELETE_LABELS: Record<MoreMenuType, { edit: string; delete: string }> = {
  post: { edit: '게시글 수정', delete: '게시글 삭제' },
  comment: { edit: '댓글 수정', delete: '댓글 삭제' },
};

interface MoreButtonProps {
  /** 메뉴 타입: 게시글(PostCard)용 | 댓글(Comment)용 */
  type?: MoreMenuType;
  /** 작성자 여부. true일 때만 수정/삭제 메뉴 노출 */
  isAuthor?: boolean;
  /** 게시글용: 이걸 넘기면 버튼 클릭 시 이 함수만 호출 (useFeedPostMoreMenu 등 공통 로직 사용 시) */
  onOpenMenu?: () => void;
  /** 게시글/댓글 수정 클릭 시 (onOpenMenu 없을 때만 사용) */
  onEdit?: () => void;
  /** 게시글/댓글 삭제 클릭 시 (onOpenMenu 없을 때만 사용) */
  onDelete?: () => void;
  /** 신고 클릭 시 (onOpenMenu 없을 때만 사용) */
  onReport?: () => void;
}

/** 더보기 버튼
 * - 클릭 시 바텀시트로 더보기 메뉴 노출
 * - type에 따라 게시글/댓글 메뉴 항목 분기
 * - 수정/삭제는 작성자(isAuthor)에게만 노출, 신고는 모두에게 노출
 * @example
 * <MoreButton type="post" isAuthor={isMyPost} />
 * <MoreButton type="comment" isAuthor={isMyComment} />
 */
export default function MoreButton({
  type = 'post',
  isAuthor = false,
  onOpenMenu,
  onEdit,
  onDelete,
  onReport,
}: MoreButtonProps) {
  const { onOpen, onClose } = useBottomSheetStore();
  const labels = EDIT_DELETE_LABELS[type];
  const items: { value: string; label: string }[] = [
    ...(isAuthor ? [
      { value: 'edit', label: labels.edit },
      { value: 'delete', label: labels.delete },
    ] : []),
    { value: 'report', label: '신고' },
  ];

  const handleMenuAction = (value: string) => {
    onClose(); // 먼저 시트 닫기 (닫은 뒤에 이동해야 시트가 상세 페이지까지 따라오지 않음)
    if (value === 'edit') onEdit?.();
    else if (value === 'delete') onDelete?.();
    else if (value === 'report') onReport?.();
  };

  const handleMoreButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === 'post' && onOpenMenu) {
      onOpenMenu();
      return;
    }
    onOpen({
      closeOnOverlayClick: true,
      content: (
        <div className={styles.menuList}>
          {items.map((item) => (
            <button
              key={item.value}
              type="button"
              className={styles.menuItem}
              onClick={(e) => {
                e.stopPropagation();
                handleMenuAction(item.value);
              }}
            >
              <span className={styles.menuLabel}>{item.label}</span>
            </button>
          ))}
        </div>
      ),
    });
  };

  return (
    <button className={styles.moreButton} aria-label="더보기 버튼" onClick={handleMoreButtonClick}>
      <Icon name='IconMLine3DotVertical' />
    </button>
  );
}

const styles = {
  moreButton: cn(
    'text-grey-9',
    'transition-all duration-100 active:scale-90',
  ),
  menuList: 'flex flex-col gap-0',
  menuItem: cn(
    'w-full py-3 text-left',
    'body-5 text-grey-11',
    'transition-colors active:bg-grey-1-1',
  ),
  menuLabel: 'block',
};
