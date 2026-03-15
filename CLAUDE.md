# c-wysiwyg

WYSIWYG 에디터 프로젝트. 라이브러리 없이 `contenteditable` + `document.execCommand` + Selection API로 직접 구현.

## 개발 명령어

```bash
npm run dev    # 개발 서버 (기본 포트 3000, 이미 사용 중이면 3001)
npm run build  # 프로덕션 빌드
npm run lint   # ESLint 검사
```

## 기술 스택

- **Next.js 16.1.6** — App Router, `'use client'` 컴포넌트
- **React 19.2.3** — TypeScript
- **Tailwind CSS v4** — CSS 기반 설정 (`globals.css`에서 `@plugin` 사용, `tailwind.config.ts` 없음)
- **@tailwindcss/typography** — prose 스타일

## 프로젝트 구조

```
src/
  app/
    globals.css          # Tailwind + 에디터 커스텀 CSS
    layout.tsx
    page.tsx             # EditorPage 렌더링
  components/editor/
    EditorPage.tsx       # 메인 클라이언트 컴포넌트 (상태 관리, 이벤트 처리)
    Editor.tsx           # contenteditable div
    Toolbar.tsx          # 전체 툴바 조합
    SaveModal.tsx        # HTML 출력 모달 (React portal)
    types.ts             # FormatState 타입
    toolbar/
      HeadingControl.tsx    # Paragraph / H1 / H2 / H3 선택
      FontSizeControl.tsx   # px 단위 폰트 크기 선택
      ColorControl.tsx      # 글자 색상 (color input)
      AlignmentControl.tsx  # 좌/중/우/양끝 정렬
  lib/
    imageToBase64.ts     # File → base64 data URL 변환
```

## 핵심 구현 패턴

### 선택 영역 보존
툴바 버튼 클릭 시 에디터 포커스가 유지되도록 `onMouseDown` + `e.preventDefault()` 사용.
`<select>`, `<input type="color">` 등 네이티브 컨트롤은 포커스를 뺏으므로, `selectionchange` 이벤트로 `savedRangeRef`에 최신 범위를 저장하고 커맨드 실행 직전에 복원.

### 폰트 크기
`document.execCommand('fontSize')` 는 1–7 단위만 지원하므로, 선택 영역 HTML을 `insertHTML`로 `<span style="font-size:${size}">` 로 감싸는 방식으로 구현.

### 이미지 첨부
드래그&드롭 시 `FileReader`로 base64 변환 후 `insertHTML`로 삽입.

### YouTube 임베드
- **붙여넣기**: `onPaste`에서 YouTube URL 감지 → `insertHTML`로 `<iframe>` 삽입, 기본 텍스트 삽입 방지(`e.preventDefault()`)
- **툴바 입력**: URL 입력 필드에서 직접 embed

### 모달
`SaveModal`은 `createPortal`로 `document.body`에 렌더링. SSR 이슈 방지를 위해 `useState(false)` + `useEffect`로 마운트 후 포털 활성화.

## 주의 사항

- `document.execCommand`는 deprecated API이지만 현재 모든 브라우저에서 동작함
- Tailwind v4는 `tailwind.config.ts` 대신 `globals.css`에서 `@plugin` 으로 플러그인 설정
- `'use client'` 없이 Next.js App Router에서 브라우저 API 사용 불가
