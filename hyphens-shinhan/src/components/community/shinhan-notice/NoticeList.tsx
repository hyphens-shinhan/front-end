import Separator from "@/components/common/Separator";
import NoticeCard from "./NoticeCard";

export default function NoticeList() {
    return (
        <div>
            <NoticeCard />
            <Separator />
            <NoticeCard />
            <Separator />
        </div>
    );
}