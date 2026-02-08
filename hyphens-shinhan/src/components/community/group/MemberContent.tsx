import { memo } from "react";
import { Icon } from "@/components/common/Icon";
import { cn } from "@/utils/cn";
import MemberCard from "./MemberCard";

function MemberContent() {
  return (
    <div>
      <div className={styles.memberCountContainer}>
        <p className={styles.memberCountText}>전체 81명</p>
        <Icon name="IconLLineSort" size={24} />
      </div>

      <div className={styles.memberListContainer}>
        <MemberCard />
        <MemberCard />
        <MemberCard />
        <MemberCard />
        <MemberCard />
        <MemberCard />
        <MemberCard />
        <MemberCard />
        <MemberCard />
        <MemberCard />
        <MemberCard />
        <MemberCard />
        <MemberCard />
        <MemberCard />
        <MemberCard />
        <MemberCard />
      </div>
    </div>
  );
}

export default memo(MemberContent);

const styles = {
  memberCountContainer: cn("flex items-center justify-between pt-1 pb-4"),
  memberCountText: cn("body-7 text-grey-10"),
  memberListContainer: cn("flex flex-col items-start grid grid-cols-4 gap-2"),
};
