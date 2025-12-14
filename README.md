# 🎬 Netflix Demo

TMDB API를 활용한 Netflix 스타일의 영화 추천 웹 애플리케이션

![Vue.js](https://img.shields.io/badge/Vue.js-3.4-4FC08D?logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite&logoColor=white)

## 📋 프로젝트 소개

Netflix 스타일의 UI/UX를 구현한 영화 추천 SPA(Single Page Application)입니다. TMDB(The Movie Database) API를 활용하여 실시간 영화 데이터를 제공하며, 사용자 맞춤형 찜하기 기능과 다양한 정렬/필터링 옵션을 제공합니다.

### 주요 기능

- 🎯 **4개 TMDB API 활용**: 인기 영화, 현재 상영작, 최고 평점, 개봉 예정작
- ❤️ **찜하기 시스템**: localStorage 기반 사용자별 찜 목록 관리
- 🔍 **영화 검색**: 실시간 검색 및 Pagination
- 📊 **대세 콘텐츠**: Table View / 무한 스크롤 듀얼 모드
- 📱 **완벽한 반응형**: 모바일, 태블릿, 데스크톱 대응
- ✨ **7개 이상 애니메이션**: CSS Transition & Animation
- 🔐 **로그인 시스템**: 이메일 검증 및 API 키 인증

## 🛠 기술 스택

### Frontend Framework
- **Vue 3** (Composition API)
- **TypeScript** 5.3
- **Vite** 5.0

### 상태 관리 & 라우팅
- **Pinia** - 상태 관리
- **Vue Router** - 클라이언트 사이드 라우팅

### UI/UX
- **CSS3** - 커스텀 스타일링
- **Font Awesome** - 아이콘
- **Vue Toastification** - 토스트 알림

### API
- **TMDB API** - 영화 데이터
- **Axios** - HTTP 클라이언트

### Storage
- **localStorage** - 찜 목록 및 로그인 정보 저장

## 📦 설치 및 실행 가이드

### 사전 요구사항

- Node.js 18.x 이상
- npm
- TMDB API 키 ([발급 방법](#tmdb-api-키-발급-방법))

### 1. 저장소 클론

```bash
git clone <repository-url>
cd netflix-demo
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 4. 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

### 5. 프로덕션 미리보기

```bash
npm run preview
```

## 🔑 TMDB API 키 발급 방법

애플리케이션 사용을 위해 TMDB API 키가 필요합니다.

1. [TMDB 웹사이트](https://www.themoviedb.org/)에서 계정 생성
2. 로그인 후 Settings > API 메뉴로 이동
3. "Create" 버튼 클릭 > "Developer" 선택
4. 필요한 정보 입력 (개인/학습 목적으로 작성)
5. **API Key (v3 auth)** 복사
6. 애플리케이션 로그인 페이지에서 이메일과 함께 입력

> **참고**: API 키는 로그인 시 입력하며, localStorage에 저장됩니다. 환경 변수 설정이 필요하지 않습니다.

## 📁 프로젝트 구조

```
netflix-demo/
├── src/
│   ├── assets/                 # 에셋 파일
│   │   ├── images/            # 이미지 파일
│   │   └── styles/            
│   │       ├── animation.css     # CSS 애니메이션 정의
│   │       ├── main.css          # 기본 스타일 및 CSS 변수
│   │       ├── responsive.css    # 반응형 미디어 쿼리
│   │       └── transition.css    # CSS 전환 효과
│   │      
│   ├── components/             # Vue 컴포넌트
│   │   ├── common/            # 공통 컴포넌트
│   │   │   ├── AppHeader.vue  # 헤더 (네비게이션, 로그인 상태)
│   │   │   ├── Loading.vue    # 로딩 스피너
│   │   │   └── Toast.vue      # 토스트 알림 컴포넌트
│   │   │
│   │   └── movie/             # 영화 관련 컴포넌트
│   │       ├── MovieCard.vue  # 영화 카드 (포스터, 정보, 찜하기)
│   │       ├── MovieGrid.vue  # 영화 그리드 레이아웃
│   │       ├── MovieInfiniteScroll.vue  # 무한 스크롤 컴포넌트
│   │       ├── MovieTable.vue # Table View 컴포넌트
│   │       ├── Pagination.vue # 페이지네이션
│   │       └── ViewToggle.vue # Table View / 무한 스크롤 토글
│   │
│   ├── composables/            # Composition API 유틸리티
│   │   ├── useAuth.ts          # 인증 관련 로직
│   │   ├── useMovies.ts        # 영화 데이터 관리
│   │   ├── useWishlist.ts      # 찜하기 로직
│   │   └── useInfiniteScroll.ts # 무한 스크롤 로직
│   │
│   ├── router/                 # 라우팅 설정
│   │   └── index.ts           # Vue Router 설정
│   │
│   ├── services/               # API 서비스
│   │   ├── auth.ts            # 인증 API 서비스
│   │   └── tmdb.ts            # TMDB API 호출 함수
│   │
│   ├── stores/                 # Pinia 스토어
│   │   ├── auth.ts            # 인증 상태 관리
│   │   ├── movie.ts           # 영화 데이터 상태 관리
│   │   └── wishlist.ts        # 찜 목록 상태 관리
│   │
│   ├── types/                  # TypeScript 타입 정의
│   │   └── movie.ts           # Movie 인터페이스
│   │
│   ├── utils/
│   │   ├── localStorage.ts     # localStorage 헬퍼 함수
│   │   └── validators.ts       # 입력값 검증 함수
│   │
│   ├── views/                  # 페이지 컴포넌트
│   │   ├── Home.vue           # 홈 (4개 영화 섹션)
│   │   ├── Popular.vue        # 대세 콘텐츠 (Table/Infinite)
│   │   ├── Search.vue         # 검색 페이지
│   │   ├── Wishlist.vue       # 찜한 리스트
│   │   └── SignIn.vue         # 로그인 페이지
│   │
│   ├── App.vue                 # 루트 컴포넌트
│   ├── main.ts                 # 앱 진입점
│   └── vite-env.d.ts          # Vite 환경 타입
│
├── .gitignore                  # Git 제외 파일
├── index.html                  # HTML 진입점
├── package.json                # 프로젝트 의존성
├── tsconfig.json               # TypeScript 설정
├── vite.config.ts              # Vite 설정
└── README.md                   # 프로젝트 문서
```

## 🎨 주요 페이지

### 1. Home (`/`)
- Hero Section (대형 Featured 영화)
- 4개 영화 섹션 (가로 스크롤)
  - 인기 영화 (Popular)
  - 현재 상영작 (Now Playing)
  - 최고 평점 (Top Rated)
  - 개봉 예정작 (Upcoming)

### 2. 대세 콘텐츠 (`/popular`)
- **Table View**: 화면 크기 기반 동적 개수 표시, Pagination
- **무한 스크롤**: 자동 로드, Scroll to Top 버튼
- ViewToggle로 모드 전환

### 3. 찾아보기 (`/search`)
- 실시간 검색
- Pagination
- 검색 결과 없음 처리

### 4. 내가 찜한 리스트 (`/wishlist`)
- 찜한 영화 목록
- 7가지 정렬 옵션
- 통계 정보 (평균 평점, 최고 평점 영화 등)
- 전체 삭제 기능

### 5. 로그인 (`/signin`)
- 이메일 형식 검증
- TMDB API 키 입력 및 검증
- 전환 애니메이션

## 💾 localStorage 구조

### Key-Value 저장소 (6개)

애플리케이션은 사용자별 데이터를 localStorage에 저장하여 관리합니다.

| Key | 값 타입 | 설명 |
|-----|--------|------|
| `isLoggedIn` | boolean | 로그인 상태 |
| `userEmail` | string | 사용자 이메일 |
| `tmdbApiKey` | string | TMDB API 키 (로그인 시 입력) |
| `wishlist_{email}` | Movie[] | 사용자별 찜 목록 |
| `currentUser` | string | 현재 로그인 사용자 이메일 |
| `loginTimestamp` | number | 로그인 시간 (타임스탬프) |

> **참고**: 각 사용자의 찜 목록은 이메일 주소를 키로 사용하여 분리 저장됩니다.

## ✨ CSS Transition & Animation (7개 이상)

1. **MovieCard Hover**: 확대 + 그림자 효과
2. **찜하기 버튼**: 하트 아이콘 크기 변화
3. **Hero Section**: Fade-in 애니메이션
4. **페이지 전환**: Route transition
5. **로딩 스피너**: 회전 애니메이션
6. **버튼 호버**: 색상 전환 효과
7. **Scroll to Top**: 등장/사라짐 애니메이션
8. **메뉴 호버**: 밑줄 애니메이션

## 📱 반응형 디자인

### Breakpoints

| 화면 크기 | 너비 | 레이아웃 |
|----------|------|---------|
| 모바일 | ≤480px | 1열, 햄버거 메뉴 |
| 작은 태블릿 | ≤768px | 2열, 햄버거 메뉴 |
| 태블릿 | ≤1024px | 3열, 축소 메뉴 |
| 데스크톱 | >1024px | 4-6열, 전체 메뉴 |

### 반응형 기능
- **헤더 네비게이션**: 햄버거 메뉴 (≤768px)
- **영화 그리드**: 화면 크기별 자동 조정
- **ViewToggle**: 모든 화면에서 가로 배치
- **통계 카드**: 크기 및 레이아웃 자동 조정
- **정렬 옵션**: 텍스트 줄바꿈 방지

## 🔐 보안 고려사항

- **API 키 관리**: 사용자가 로그인 시 직접 입력하며 localStorage에 저장
- **환경 변수 불필요**: .env 파일 설정 없이 동작
- **데이터 격리**: 사용자별 찜 목록 분리 저장
- **민감 정보**: 데모 목적으로 암호화 미적용

> **프로덕션 환경**: 실제 서비스에서는 API 키를 서버에서 관리하고 사용자 인증을 추가해야 합니다.

## 🚀 배포

### GitHub Pages 배포

```bash
# 빌드
npm run build

# dist 폴더를 GitHub Pages에 배포
# vite.config.ts의 base 경로를 repository 이름으로 설정 필요
```

**vite.config.ts 예시:**
```typescript
export default defineConfig({
  base: '/netflix-clone/', // repository 이름
  // ...
})
```

### 기타 배포 옵션
- **Vercel**: GitHub 연동으로 자동 배포
- **Netlify**: Drag & Drop 또는 Git 연동
- **AWS S3 + CloudFront**: 정적 호스팅

## 🎯 구현된 필수 요구사항

### CSS & 반응형
- ✅ CSS Transition & Animation 7개 이상
- ✅ 반응형 웹 (모바일, 태블릿, 데스크톱)
- ✅ 9개 이상 미디어 쿼리

### localStorage
- ✅ 6개 Key-Value 저장
- ✅ 사용자별 데이터 구분 (이메일 기반)

### 페이지 구성
- ✅ Home: 4개 TMDB API, 영화 카드 (포스터, 제목, 설명)
- ✅ Popular: Table View (Pagination) / 무한 스크롤
- ✅ Search: 실시간 검색, Pagination
- ✅ Wishlist: 찜 목록, 정렬, 통계
- ✅ SignIn: 이메일 검증, API 키 검증

### 추가 기능
- ✅ 찜하기 시스템
- ✅ 사용자 인증
- ✅ Toast 알림

## 📄 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.

## 👨‍💻 개발자

- **개발자**: 서현
- **이메일**: sh99429@naver.com
- **과제**: WSD 2차 과제

## 🙏 감사의 말

- [TMDB](https://www.themoviedb.org/) - 영화 데이터 API 제공
- [Vue.js](https://vuejs.org/) - 프론트엔드 프레임워크
- [Font Awesome](https://fontawesome.com/) - 아이콘 라이브러리
- [Vite](https://vitejs.dev/) - 빌드 도구

---