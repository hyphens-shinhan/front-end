// src/components/common/BottomNav.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BottomNav from './BottomNav';

// Next.js의 usePathname, Link 등을 모킹(가짜로 생성)함
vi.mock('next/navigation', () => ({
    usePathname: () => '/home',
}));

describe('BottomNav 컴포넌트', () => {
    it('모든 네비게이션 메뉴(홈, 네트워킹, 장학, 프로필)가 화면에 표시된다', () => {
        render(<BottomNav userRole="YB" />);

        expect(screen.getByText('홈')).toBeInTheDocument();
        expect(screen.getByText('커뮤니티')).toBeInTheDocument();
        expect(screen.getByText('네트워킹')).toBeInTheDocument();
        expect(screen.getByText('활동')).toBeInTheDocument();
        expect(screen.getByText('마이페이지')).toBeInTheDocument();
    });
});