import { cn } from "@/utils/cn";

/**
 * 구분선 컴포넌트
 * @returns 구분선 컴포넌트
 */
export default function Separator({ className }: { className?: string }) {
    return <div className={cn("h-[1px] bg-grey-3", className)} />;
}
