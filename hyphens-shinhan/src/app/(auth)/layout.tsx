export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section className="flex min-h-screen items-center justify-center bg-white">
            {children}
        </section>
    );
}