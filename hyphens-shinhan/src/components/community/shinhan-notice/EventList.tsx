import Separator from "@/components/common/Separator";
import EventCard from "./EventCard";

export default function EventList() {
    return (
        <div>
            <EventCard />
            <Separator />
            <EventCard />
            <Separator />
        </div>
    );
}