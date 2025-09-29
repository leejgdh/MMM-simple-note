# MMM-Simple-Note

Next.js + TypeScript 풀스택 기반의 MagicMirror 노트 시스템입니다. 완전히 독립적인 관리자 서버와 MagicMirror 모듈로 구성되어 있습니다.

## 🏗️ 아키텍처

```
┌─────────────────────┐    ┌─────────────────────────────┐
│   MagicMirror       │    │      Admin Server           │
│   Docker Container  │    │    Docker Container         │
│                     │    │                             │
│  ┌─────────────────┐│    │  ┌─────────────────────────┐│
│  │ MMM-simple-note ││<-->│  │  Next.js Fullstack      ││
│  │ (display only)  ││    │  │  React + API Routes     ││
│  └─────────────────┘│    │  │  Prisma + SQLite        ││
└─────────────────────┘    │  └─────────────────────────┘│
                           └─────────────────────────────┘
```

## 📦 구성 요소

### 1. MagicMirror 모듈 (`magic-mirror-module/`)
- 순수 프론트엔드 디스플레이 모듈
- HTTP API를 통해 노트 데이터 fetch
- 실시간 업데이트 지원

### 2. 관리자 서버 (`admin-server/`)
- **풀스택**: Next.js 14+ (App Router)
- **프론트엔드**: React + TypeScript + TailwindCSS
- **백엔드**: Next.js API Routes
- **데이터베이스**: SQLite with Prisma ORM
- **컨테이너**: Docker standalone build

## 🚀 설치 및 실행

### 관리자 서버 실행 (Docker)

```bash
# Docker Compose로 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f admin-server

# 서비스 중지
docker-compose down
```

### 개발 모드 실행

#### Next.js 개발 모드
```bash
cd admin-server
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### MagicMirror 모듈 설치

1. `magic-mirror-module/` 내용을 MagicMirror의 `modules/MMM-simple-note/`에 복사
2. MagicMirror `config.js`에 모듈 설정 추가:

```javascript
{
  module: "MMM-simple-note",
  position: "top_left",
  config: {
    apiUrl: "http://admin-server-host:3000/api", // 관리자 서버 URL
    updateInterval: 60000,
    maxNotes: 5,
    showTitle: true
  }
}
```

## 🔌 API 엔드포인트

### REST API (Next.js API Routes)
- `GET /api/notes` - 모든 노트 조회
- `POST /api/notes` - 새 노트 생성
- `GET /api/notes/[id]` - 특정 노트 조회
- `PUT /api/notes/[id]` - 노트 수정
- `DELETE /api/notes/[id]` - 노트 삭제
- `GET /api/health` - 서버 상태 확인

## 🎨 관리자 패널

관리자 서버 실행 후 `http://localhost:3000`에서 접근 가능

**기능:**
- 📝 노트 생성/수정/삭제
- 🔄 실시간 업데이트
- 📱 반응형 디자인
- 🇰🇷 한국어 지원
- ⚡ TypeScript로 작성된 타입 안전한 인터페이스

## 💾 데이터베이스

SQLite 데이터베이스는 Docker 볼륨에 저장됩니다.

**스키마:**
```sql
CREATE TABLE notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 기술 스택

### 풀스택
- **Next.js 14+**: React 기반 풀스택 프레임워크 (App Router)
- **TypeScript**: 타입 안전한 JavaScript
- **React**: 사용자 인터페이스 라이브러리
- **TailwindCSS**: 유틸리티 우선 CSS 프레임워크

### 백엔드
- **Next.js API Routes**: 서버리스 API 엔드포인트
- **Prisma**: 현대적인 TypeScript ORM
- **SQLite**: 파일 기반 데이터베이스

### 인프라
- **Docker**: 컨테이너화
- **Standalone Build**: 최적화된 프로덕션 빌드

## 🌐 환경 변수

- `NODE_ENV`: 환경 설정 (production/development)
- `DATABASE_URL`: 데이터베이스 연결 URL (Docker에서 자동 설정)

## 🔄 독립적 운영

이 시스템은 MagicMirror와 완전히 독립적으로 운영 가능합니다:

1. **관리자 서버**: 단독으로 노트 관리 웹 애플리케이션으로 사용 가능
2. **API 서버**: 다른 클라이언트에서도 REST API 사용 가능
3. **MagicMirror 모듈**: API 엔드포인트만 설정하면 어디서든 연결 가능

## 🏥 헬스 체크

```bash
# 서버 상태 확인
curl http://localhost:3000/api/health

# 웹 관리자 패널 접근
open http://localhost:3000
```