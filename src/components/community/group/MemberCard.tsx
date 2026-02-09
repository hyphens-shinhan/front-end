import { cn } from "@/utils/cn";
import Avatar from "@/components/common/Avatar";

interface MemberCardProps {
  /** 멤버 이름 */
  name: string;
  /** 멤버 프로필 이미지 URL */
  avatarUrl?: string | null;
}

export default function MemberCard({ name, avatarUrl }: MemberCardProps) {
  return (
    <div className={styles.container}>
      <Avatar
        src={avatarUrl}
        alt={name}
        size={58}
        containerClassName={styles.imageContainer}
      />
      <p className={styles.name}>{name}</p>
    </div>
  );
}

const styles = {
  container: cn("flex flex-col items-center gap-2"),
  imageContainer: cn("w-14.5 h-14.5 rounded-full"),
  name: cn("body-7 text-grey-10"),
};
