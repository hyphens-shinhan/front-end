export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="mx-auto max-w-md min-h-screen border-x bg-white">
            {/* 나중에 여기에 <Header />나 <Navbar /> 추가 */}
            <main className="p-4">{children}</main>
        </div>
    );
}