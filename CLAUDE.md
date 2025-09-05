# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

이 프로젝트는 **쇼핑몰 상세페이지 AI 에디터**입니다. 사용자가 AI 프롬프트를 통해 상품 상세페이지를 자동 생성하고, 드래그 앤 드롭과 실시간 편집 기능을 제공하는 웹 애플리케이션입니다.

### 핵심 기능
- **AI 기반 페이지 생성**: 프롬프트 입력으로 상세페이지 자동 생성
- **템플릿 시스템**: 다양한 상세페이지 템플릿 제공
- **드래그 앤 드롭 에디터**: 요소들을 자유롭게 배치/재배열
- **실시간 텍스트 편집**: 인라인 텍스트 수정
- **이미지 편집**: 업로드, 크롭, 리사이즈 등

## 기술 스택

- **프레임워크**: Next.js 15 (App Router) + TypeScript
- **스타일링**: Tailwind CSS 4
- **상태관리**: Zustand (예정)
- **드래그 앤 드롭**: React DnD (예정)
- **이미지 편집**: Fabric.js (예정)
- **AI API**: OpenAI/Claude API (예정)
- **UI 컴포넌트**: Headless UI + Radix UI (예정)
- **데이터베이스**: Prisma + PostgreSQL (예정)
- **파일 업로드**: Uploadthing (예정)

## 개발 명령어

```bash
# 개발 서버 시작 (Turbopack 사용)
npm run dev

# 프로덕션 빌드 (Turbopack 사용) 
npm run build

# 프로덕션 서버 시작
npm run start

# 린팅 실행
npm run lint
```

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── page.tsx           # 홈페이지
│   ├── layout.tsx         # 루트 레이아웃
│   ├── globals.css        # 전역 스타일
│   └── api/               # API 라우트
├── components/            # 재사용 가능한 컴포넌트
│   ├── ui/               # 기본 UI 컴포넌트
│   ├── editor/           # 에디터 관련 컴포넌트
│   ├── templates/        # 페이지 템플릿 컴포넌트
│   └── common/           # 공통 컴포넌트
├── lib/                  # 유틸리티와 설정
│   ├── utils.ts          # 헬퍼 함수
│   ├── types.ts          # TypeScript 타입 정의
│   ├── store.ts          # Zustand 상태 관리
│   └── api.ts            # API 클라이언트
├── hooks/                # 커스텀 리액트 훅
└── styles/               # 추가 스타일 파일
```

## 아키텍처 원칙

### 컴포넌트 구조
- **UI 컴포넌트**: `components/ui/`에서 재사용 가능한 기본 컴포넌트 관리
- **에디터 컴포넌트**: `components/editor/`에서 드래그 앤 드롭, 편집 관련 컴포넌트
- **템플릿 컴포넌트**: `components/templates/`에서 상세페이지 템플릿들을 컴포넌트화

### 상태 관리
- **Zustand**: 글로벌 상태 관리 (에디터 상태, 템플릿 데이터 등)
- **Local State**: 컴포넌트별 단순한 UI 상태는 useState 활용

### API 구조
- **RESTful API**: `/api/` 디렉토리에서 Next.js API 라우트 활용
- **AI 통합**: OpenAI/Claude API를 통한 콘텐츠 생성
- **파일 업로드**: Uploadthing을 통한 이미지 관리

## 개발 가이드라인

### 컴포넌트 작성
- 모든 컴포넌트는 TypeScript로 작성
- Props 인터페이스를 명확히 정의
- 재사용성을 고려한 컴포넌트 설계

### 스타일링
- Tailwind CSS의 유틸리티 클래스 우선 사용
- 복잡한 스타일의 경우 CSS 모듈 또는 styled-components 활용
- 반응형 디자인 필수 적용

### 타입 안전성
- `lib/types.ts`에 공통 타입 정의
- API 응답, 컴포넌트 Props, 상태 객체 등 모든 데이터 구조 타이핑
- strict 모드에서 타입 에러 제로 유지

### 성능 최적화
- Next.js Image 컴포넌트 활용
- 동적 import를 통한 코드 스플리팅
- React.memo, useMemo, useCallback 적절한 활용

## AI 에디터 핵심 기능 구현 방향

### 드래그 앤 드롭 시스템
- React DnD를 활용한 요소 배치
- 그리드 시스템 기반 레이아웃
- 실시간 미리보기 제공

### AI 콘텐츠 생성
- 프롬프트 기반 HTML/CSS 생성
- 상품 정보를 활용한 컨텍스트 제공
- 생성된 콘텐츠의 편집 가능한 구조화

### 템플릿 시스템
- JSON 기반 템플릿 정의
- 컴포넌트 매핑을 통한 동적 렌더링
- 사용자 정의 템플릿 저장 기능

## 주의사항

- 프로덕션 빌드 전 반드시 `npm run lint` 실행
- 모든 에디터 기능은 실시간 미리보기 제공
- AI 생성 콘텐츠는 사용자 편집 가능하게 구조화
- 이미지 최적화와 로딩 성능 고려
- 접근성(a11y) 가이드라인 준수

## 테스트

현재 테스트 환경은 설정되어 있지 않습니다. 향후 다음 도구들을 추가할 예정:
- Jest + React Testing Library
- Playwright (E2E 테스트)
- Storybook (컴포넌트 문서화)