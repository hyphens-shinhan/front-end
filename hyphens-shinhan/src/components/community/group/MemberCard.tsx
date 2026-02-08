import { cn } from "@/utils/cn";

export default function MemberCard() {
  return (
    <div className={styles.container}>
      <div className={styles.imageContainer} />
      <p className={styles.name}>오시온</p>
    </div>
  );
}

const styles = {
  container: cn("flex flex-col items-center gap-2"),
  imageContainer: cn("w-14.5 h-14.5 rounded-full bg-grey-3"),
  name: cn("body-7 text-grey-10"),
};
