# c-wysiwyg

외부 에디터 라이브러리 없이 `contenteditable` + `document.execCommand` + Selection API로 직접 구현한 WYSIWYG 에디터.

**라이브 데모**: https://c-wysiwyg.vercel.app

---

## 주요 기능

- **텍스트 서식** — 굵게, 기울임, 밑줄, 취소선
- **단락 스타일** — Paragraph / H1 / H2 / H3
- **글자 크기** — 12px ~ 48px (px 단위 직접 적용)
- **글자 색상** — 컬러 피커로 자유롭게 지정
- **텍스트 정렬** — 왼쪽 / 가운데 / 오른쪽 / 양끝 맞춤
- **목록** — 글머리 기호 / 번호 매기기
- **실행 취소 / 다시 실행**
- **이미지 첨부** — 에디터 영역에 드래그&드롭으로 삽입 (base64 인라인)
- **YouTube 임베드** — URL 붙여넣기 또는 툴바 입력으로 영상 삽입
- **HTML 저장** — 저장 버튼 클릭 시 결과 HTML을 모달로 확인 및 복사

---

## 기술 스택

| 항목 | 내용 |
|------|------|
| Framework | Next.js 16.1.6 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| 에디터 코어 | `contenteditable` + `document.execCommand` + Selection API |
| 배포 | Vercel |

외부 WYSIWYG 라이브러리(Tiptap, Quill, ProseMirror 등)를 사용하지 않고 브라우저 내장 API만으로 구현했습니다.

---

## 시작하기

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000 접속.

```bash
npm run build   # 프로덕션 빌드
npm run lint    # ESLint 검사
```

---

## 구현 방식

### 선택 영역 보존

툴바 버튼(`<button>`)은 `onMouseDown` + `e.preventDefault()`로 에디터 포커스를 유지합니다.
`<select>`, `<input type="color">` 같은 네이티브 컨트롤은 포커스를 뺏으므로, `selectionchange` 이벤트로 마지막 Range를 `savedRangeRef`에 저장하고 커맨드 실행 전에 복원합니다.

### 글자 크기 (px 단위)

`document.execCommand('fontSize')`는 1–7 단계만 지원합니다. 선택 영역의 HTML을 그대로 추출해 `<span style="font-size:${size}">...</span>`으로 감싼 뒤 `insertHTML`로 재삽입하는 방식으로 px 값을 직접 적용합니다.

### 이미지 드래그&드롭

`onDrop` 핸들러에서 `FileReader`로 이미지를 base64 Data URL로 변환한 뒤 `insertHTML`로 `<img>` 태그를 삽입합니다.

### YouTube 임베드

- **붙여넣기**: `onPaste`에서 YouTube URL 정규식으로 감지 → `e.preventDefault()` 후 `<iframe>` 삽입
- **툴바 입력**: URL 입력 필드에서 직접 embed

### 저장 모달

`createPortal`로 `document.body`에 렌더링하여 z-index 스택 문제를 회피합니다. SSR 환경에서 `document` 접근 오류를 막기 위해 `useState(false)` + `useEffect`로 클라이언트 마운트 후 포털을 활성화합니다.

---

## 프로젝트 구조

```
src/
├── app/
│   ├── globals.css          # Tailwind + 커스텀 CSS (디자인 토큰, 모달 애니메이션)
│   └── page.tsx
├── components/editor/
│   ├── EditorPage.tsx       # 메인 클라이언트 컴포넌트 (상태, 이벤트)
│   ├── Editor.tsx           # contenteditable div
│   ├── Toolbar.tsx          # SVG 아이콘 툴바
│   ├── SaveModal.tsx        # HTML 출력 모달 (portal)
│   ├── types.ts             # FormatState 타입
│   └── toolbar/
│       ├── HeadingControl.tsx
│       ├── FontSizeControl.tsx
│       ├── ColorControl.tsx
│       └── AlignmentControl.tsx
└── lib/
    └── imageToBase64.ts     # File → base64 Data URL
```

---

## 주의 사항

`document.execCommand`는 deprecated API이지만 현재 모든 주요 브라우저에서 정상 동작합니다.
Tailwind CSS v4는 `tailwind.config.ts` 대신 `globals.css`의 `@plugin` 지시어로 플러그인을 설정합니다.
