import TabsLayoutClient from "./TabsLayoutClient";

export default function TabsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <TabsLayoutClient>{children}</TabsLayoutClient>;
}
