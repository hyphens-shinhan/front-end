'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function RQProvider({ children }: { children: React.ReactNode }) {
    const [client] = useState(new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false, // 탭 전환 시 자동 새로고침 방지 (선택)
                retry: false, // 실패 시 재시도 횟수 (선택)
            },
        },
    }));

    return (
        <QueryClientProvider client={client}>
            {children}
        </QueryClientProvider>
    );
}