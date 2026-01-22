# 디자인 시스템 사용 가이드

이 프로젝트는 Figma에서 추출한 디자인 토큰을 자동으로 Tailwind CSS에 등록하여 사용합니다.

## 📋 목차

1. [디자인 시스템 개요](#디자인-시스템-개요)
2. [폰트 사용하기](#폰트-사용하기)
3. [컬러 사용하기](#컬러-사용하기)
4. [스페이싱 사용하기](#스페이싱-사용하기)
5. [전체 유틸리티 클래스 목록](#전체-유틸리티-클래스-목록)
6. [디자인 토큰 업데이트하기](#디자인-토큰-업데이트하기)

---

## 디자인 시스템 개요

디자인 토큰은 `tokens.json` 파일에 저장되어 있으며, `scripts/process-tokens.js` 스크립트를 통해 자동으로 Tailwind CSS 유틸리티 클래스로 변환됩니다.

- **토큰 파일**: `tokens.json`
- **생성 스크립트**: `scripts/process-tokens.js`
- **생성된 CSS**: `src/styles/variables.css`
- **글로벌 스타일**: `src/app/globals.css`

---

## 폰트 사용하기

### 1. 폰트 유틸리티 클래스 사용 (권장)

디자인 시스템에서 정의한 폰트 스타일을 유틸리티 클래스로 사용할 수 있습니다.

#### Title 스타일

```tsx
// 작은 제목 (14px, Bold)
<h1 className="title-1">제목 1</h1>

// 일반 제목 (18px, Bold)
<h2 className="title">제목</h2>
```

#### 신한 폰트 Title

```tsx
// 신한 제목 1 (20px, Bold, OneShinhan)
<h1 className="shinhan-title-1">신한은행</h1>

// 신한 제목 2 (18px, Bold, OneShinhan)
<h2 className="shinhan-title-2">신한 제목 2</h2>
```

#### Body 스타일

```tsx
// Body 1 (24px, Regular)
<p className="body-1">큰 본문 텍스트</p>

// Body 2 (20px, Regular)
<p className="body-2">본문 텍스트</p>

// Body 3 (18px, Bold)
<p className="body-3">굵은 본문 텍스트</p>

// Body 4 (18px, Regular)
<p className="body-4">일반 본문 텍스트</p>

// Body 5 (16px, SemiBold)
<p className="body-5">중간 굵기 본문</p>

// Body 6 (16px, Regular)
<p className="body-6">일반 본문</p>

// Body 7 (14px, SemiBold)
<p className="body-7">작은 굵은 본문</p>

// Body 8 (14px, Regular)
<p className="body-8">작은 본문</p>

// Body 9 (12px, SemiBold)
<p className="body-9">아주 작은 굵은 본문</p>

// Body 10 (12px, Regular)
<p className="body-10">아주 작은 본문</p>
```

#### Caption 스타일

```tsx
// Caption 1 (10px, Regular)
<span className="font-caption-caption1">캡션 1</span>

// Caption 2 (14px, Regular)
<span className="font-caption-caption2">캡션 2</span>

// Caption 3 (12px, SemiBold)
<span className="font-caption-caption3">굵은 캡션</span>

// Caption 4 (12px, Regular)
<span className="font-caption-caption4">일반 캡션</span>

// Caption 5 (10px, SemiBold)
<span className="font-caption-caption5">작은 굵은 캡션</span>
```

### 2. 폰트 패밀리만 사용하기

특정 폰트만 적용하고 싶을 때는 폰트 패밀리 클래스를 사용합니다.

```tsx
// Wanted Sans 폰트 적용
<div className="font-sans">Wanted Sans 폰트</div>

// OneShinhan 폰트 적용
<div className="font-shinhan">OneShinhan 폰트</div>
```

### 3. 폰트 스타일 상세 정보

| 클래스 | 폰트 패밀리 | 크기 | 굵기 | 줄간격 |
|--------|------------|------|------|--------|
| `title-1` | Wanted Sans | 14px | 700 (Bold) | 20px |
| `title` | Wanted Sans | 18px | 700 (Bold) | 22px |
| `shinhan-title-1` | OneShinhan | 20px | 700 (Bold) | 20px |
| `shinhan-title-2` | OneShinhan | 18px | 700 (Bold) | 22px |
| `body-1` | Wanted Sans | 24px | 400 (Regular) | 29px |
| `body-2` | Wanted Sans | 20px | 400 (Regular) | 24px |
| `body-3` | Wanted Sans | 18px | 700 (Bold) | 22px |
| `body-4` | Wanted Sans | 18px | 400 (Regular) | 24px |
| `body-5` | Wanted Sans | 16px | 600 (SemiBold) | 22px |
| `body-6` | Wanted Sans | 16px | 400 (Regular) | 22px |
| `body-7` | Wanted Sans | 14px | 600 (SemiBold) | 20px |
| `body-8` | Wanted Sans | 14px | 400 (Regular) | 20px |
| `body-9` | Wanted Sans | 12px | 600 (SemiBold) | 18px |
| `body-10` | Wanted Sans | 12px | 400 (Regular) | 18px |
| `font-caption-caption1` | Wanted Sans | 10px | 400 (Regular) | 11px |
| `font-caption-caption2` | Wanted Sans | 14px | 400 (Regular) | 20px |
| `font-caption-caption3` | Wanted Sans | 12px | 600 (SemiBold) | 14px |
| `font-caption-caption4` | Wanted Sans | 12px | 400 (Regular) | 14px |
| `font-caption-caption5` | Wanted Sans | 10px | 600 (SemiBold) | 11px |

---

## 컬러 사용하기

디자인 시스템의 컬러는 Tailwind CSS의 컬러 유틸리티로 사용할 수 있습니다.

### Greyscale (회색조)

```tsx
// 배경색
<div className="bg-grey-2">가장 밝은 회색</div>
<div className="bg-grey-3">밝은 회색</div>
<div className="bg-grey-4">회색</div>
// ... bg-grey-5 ~ bg-grey-11

// 텍스트 색상
<p className="text-grey-11">가장 어두운 회색 텍스트</p>
<p className="text-white">흰색 텍스트</p>
<p className="text-black">검은색 텍스트</p>
```

### Primary (주요 색상)

```tsx
// Primary 색상
<button className="bg-primary text-white">Primary 버튼</button>
<button className="bg-primary-light text-white">밝은 Primary</button>
<button className="bg-primary-dark text-white">어두운 Primary</button>

// 텍스트 색상
<p className="text-primary">Primary 색상 텍스트</p>
```

### State (상태 색상)

```tsx
// 에러
<div className="bg-state-error text-white">에러 메시지</div>
<p className="text-state-error">에러 텍스트</p>

// 성공
<div className="bg-state-success text-white">성공 메시지</div>
<p className="text-state-success">성공 텍스트</p>

// 경고
<div className="bg-state-warning text-white">경고 메시지</div>
<p className="text-state-warning">경고 텍스트</p>
```

### 사용 가능한 컬러 목록

| 클래스 | 색상 값 | 용도 |
|--------|---------|------|
| `bg-white` / `text-white` | #FFFFFF | 흰색 |
| `bg-black` / `text-black` | #000000 | 검은색 |
| `bg-grey-2` ~ `bg-grey-11` | #F2F3F5 ~ #2C303D | 회색조 |
| `bg-primary` / `text-primary` | #0046FF | 주요 색상 |
| `bg-primary-light` | #4B7CFF | 밝은 주요 색상 |
| `bg-primary-dark` | #0037C8 | 어두운 주요 색상 |
| `bg-state-error` / `text-state-error` | #EF4444 | 에러 상태 |
| `bg-state-success` / `text-state-success` | #10B981 | 성공 상태 |
| `bg-state-warning` / `text-state-warning` | #F59E0B | 경고 상태 |

---

## 스페이싱 사용하기

디자인 시스템의 간격 값은 CSS 변수로 제공됩니다.

### Spacing (간격)

```tsx
// 마진
<div className="m-[var(--scheme-spacing-1)]">간격 1</div>
<div className="m-[var(--scheme-spacing-2)]">간격 2</div>
// ... m-[var(--scheme-spacing-20)]

// 패딩
<div className="p-[var(--scheme-spacing-1)]">간격 1</div>
<div className="p-[var(--scheme-spacing-2)]">간격 2</div>
```

### Margin (여백)

```tsx
<div className="m-[var(--scheme-margin-xxs)]">아주 작은 여백</div>
<div className="m-[var(--scheme-margin-xs)]">작은 여백</div>
<div className="m-[var(--scheme-margin-sm)]">작은 여백</div>
<div className="m-[var(--scheme-margin-md)]">중간 여백</div>
<div className="m-[var(--scheme-margin-lg)]">큰 여백</div>
<div className="m-[var(--scheme-margin-xl)]">아주 큰 여백</div>
<div className="m-[var(--scheme-margin-xxl)]">매우 큰 여백</div>
<div className="m-[var(--scheme-margin-xxxl)]">최대 여백</div>
```

### Radius (둥근 모서리)

```tsx
<div className="rounded-[var(--scheme-radius-1)]">반경 1</div>
<div className="rounded-[var(--scheme-radius-2)]">반경 2</div>
// ... rounded-[var(--scheme-radius-8)]
<div className="rounded-[var(--scheme-radius-max)]">최대 반경</div>
```

---

## 전체 유틸리티 클래스 목록

### 폰트 유틸리티

- **Title**: `title-1`, `title`
- **신한 Title**: `shinhan-title-1`, `shinhan-title-2`
- **Body**: `body-1` ~ `body-10`
- **Caption**: `font-caption-caption1` ~ `font-caption-caption5`
- **폰트 패밀리**: `font-sans`, `font-shinhan`

### 컬러 유틸리티

- **Greyscale**: `bg-grey-2` ~ `bg-grey-11`, `bg-white`, `bg-black`
- **Primary**: `bg-primary`, `bg-primary-light`, `bg-primary-dark`
- **State**: `bg-state-error`, `bg-state-success`, `bg-state-warning`
- **텍스트 컬러**: 모든 배경색에 대응하는 `text-*` 클래스 사용 가능

---

## 디자인 토큰 업데이트하기

Figma에서 디자인 토큰을 업데이트한 후, 다음 단계를 따라주세요:

### 1. 토큰 파일 업데이트

`tokens.json` 파일을 Figma에서 내보낸 최신 토큰으로 교체합니다.

### 2. 토큰 처리 스크립트 실행

```bash
node scripts/process-tokens.js
```

이 스크립트는 `tokens.json`을 읽어서 `src/styles/variables.css` 파일을 자동으로 생성합니다.

### 3. 변경사항 확인

생성된 `src/styles/variables.css` 파일을 확인하여 새로운 유틸리티 클래스가 제대로 생성되었는지 확인합니다.

### 4. 개발 서버 재시작 (필요시)

```bash
npm run dev
```

---

## 사용 예시

### 완전한 예시 코드

```tsx
export default function Example() {
  return (
    <div className="p-[var(--scheme-spacing-5)]">
      {/* 신한 폰트 제목 */}
      <h1 className="shinhan-title-1 text-primary">신한은행</h1>
      
      {/* 일반 제목 */}
      <h2 className="title text-grey-11">서비스 소개</h2>
      
      {/* 본문 */}
      <p className="body-6 text-grey-11">
        이것은 본문 텍스트입니다. 디자인 시스템의 body-6 스타일을 사용합니다.
      </p>
      
      {/* 버튼 */}
      <button className="bg-primary text-white body-7 px-[var(--scheme-spacing-5)] py-[var(--scheme-spacing-3)] rounded-[var(--scheme-radius-5)]">
        시작하기
      </button>
      
      {/* 에러 메시지 */}
      <div className="bg-state-error text-white body-8 p-[var(--scheme-spacing-4)] rounded-[var(--scheme-radius-3)]">
        오류가 발생했습니다.
      </div>
      
      {/* 성공 메시지 */}
      <div className="bg-state-success text-white body-8 p-[var(--scheme-spacing-4)] rounded-[var(--scheme-radius-3)]">
        성공적으로 완료되었습니다.
      </div>
    </div>
  );
}
```

---

## 주의사항

1. **폰트 파일**: 폰트 파일은 `public/fonts/` 디렉토리에 있어야 합니다.
2. **토큰 업데이트**: Figma에서 토큰을 업데이트한 후 반드시 `process-tokens.js` 스크립트를 실행해야 합니다.
3. **클래스 이름**: 유틸리티 클래스 이름은 `variables.css`에 정의된 `@utility` 블록의 이름과 정확히 일치해야 합니다.
4. **컬러 사용**: 컬러는 Tailwind CSS의 표준 방식(`bg-*`, `text-*`)으로 사용할 수 있습니다.

---

## 도움이 필요하신가요?

- 디자인 토큰 관련 문제: `tokens.json` 파일과 `scripts/process-tokens.js` 스크립트를 확인하세요.
- 스타일이 적용되지 않을 때: `src/styles/variables.css` 파일이 최신인지 확인하고, 개발 서버를 재시작해보세요.
- 폰트가 보이지 않을 때: `public/fonts/` 디렉토리에 폰트 파일이 있는지 확인하세요.
