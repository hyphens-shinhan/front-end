import * as Icons from './index'; // index.ts에서 ICON_LIST와 타입을 가져옴

interface IconProps {
    name: Icons.IconName;
    size?: number | string;
    className?: string;
    color?: string;
}

/** 아이콘 컴포넌트 
 * @param name - 아이콘 이름
 * @param size - 아이콘 크기
 * @param className - 아이콘 클래스
 * @param color - 아이콘 색상
 * @returns 아이콘 컴포넌트
*/
export const Icon = ({ name, size, className, color }: IconProps) => {
    const SVGIcon = Icons.ICON_LIST[name];

    if (!SVGIcon) return null;

    // 1. 이름에 따라 기본 사이즈 결정 (피그마 기준)
    // 예: 이름에 'IconL'이 포함되면 24, 'IconM'이 포함되면 20
    const defaultSize = name.includes('IconL') || name.includes('ViconL') ? 24 : 20;

    // 2. Props로 넘어온 size가 있으면 그것을 쓰고, 없으면 기본값 사용
    const finalSize = size ?? defaultSize;

    return (
        <SVGIcon
            width={finalSize}
            height={finalSize}
            className={className} // Tailwind 클래스가 우선 적용됨
            style={color ? { color } : undefined} // 직접 color를 넘길 때만 style 적용
        />
    );
};