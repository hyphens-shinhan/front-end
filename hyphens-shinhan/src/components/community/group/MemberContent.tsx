'use client';

import { memo } from "react";
import { cn } from "@/utils/cn";
import MemberCard from "./MemberCard";
import { useClubMembers } from "@/hooks/clubs/useClubs";
import EmptyContent from "@/components/common/EmptyContent";
import { EMPTY_CONTENT_MESSAGES } from "@/constants";
import type { ClubMemberResponse } from "@/types/clubs";

interface MemberContentProps {
  clubId: string;
}

function MemberContent({ clubId }: MemberContentProps) {
  const { data: memberData, isLoading, error } = useClubMembers(clubId);

  if (isLoading) {
    return (
      <EmptyContent
        variant="loading"
        message={EMPTY_CONTENT_MESSAGES.LOADING.DEFAULT}
      />
    );
  }

  if (error || !memberData) {
    return (
      <EmptyContent
        variant="error"
        message={EMPTY_CONTENT_MESSAGES.ERROR.GROUP}
      />
    );
  }

  const members = memberData.members || [];
  const total = memberData.total || 0;

  return (
    <div>
      <div className={styles.memberCountContainer}>
        <p className={styles.memberCountText}>전체 {total}명</p>
        {/* <Icon name="IconLLineSort" size={24} /> */}
      </div>

      {members.length === 0 ? (
        <EmptyContent
          variant="empty"
          message="멤버가 없어요."
        />
      ) : (
        <div className={styles.memberListContainer}>
          {members.map((member: ClubMemberResponse) => (
            <MemberCard
              key={member.id}
              name={member.name}
              avatarUrl={member.avatar_url}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default memo(MemberContent);

const styles = {
  memberCountContainer: cn("flex items-center justify-between pt-1 pb-4"),
  memberCountText: cn("body-7 text-grey-10"),
  memberListContainer: cn("flex flex-col items-start grid grid-cols-4 gap-2"),
};
