# 📄 Paper Reader

영어 논문 PDF를 업로드하면 자동으로 한글로 번역해주는 웹 애플리케이션입니다.

## ✨ 주요 기능

- 📤 **PDF 업로드**: 드래그 앤 드롭 또는 파일 선택으로 PDF 업로드
- 🔍 **텍스트 추출**: PDF에서 텍스트를 자동으로 추출하고 문장 단위로 분리
- 🌐 **AI 번역**: Google Gemini AI를 사용한 자연스러운 한글 번역
- 📖 **다양한 읽기 모드**: 
  - 나란히 보기 (영어 + 한글)
  - 영어만 보기
  - 한글만 보기
  - 토글 모드 (클릭으로 전환)
- 🎨 **다크 모드**: 라이트/다크 테마 지원
- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크탑 지원

## 🏗️ 프로젝트 구조

```
paper-reader/
├── api/                    # Vercel Serverless Functions
│   └── translate.js        # 번역 API 엔드포인트
├── backend/                # Python FastAPI 백엔드 (로컬 개발용)
│   ├── main.py
│   ├── requirements.txt
│   └── README.md
├── src/
│   ├── components/         # React 컴포넌트
│   ├── pages/              # 페이지 컴포넌트
│   ├── utils/              # 유틸리티 함수
│   └── contexts/           # React Context
├── public/                 # 정적 파일
├── scripts/                # 빌드 스크립트
└── package.json
```

## 🚀 빠른 시작

### 로컬 개발 환경

#### 1. 프론트엔드 설정

```bash
# 의존성 설치
npm install

# 환경 변수 설정 (.env 파일 생성)
VITE_API_URL=http://localhost:8000

# 개발 서버 실행
npm run dev
```

프론트엔드는 `http://localhost:5173`에서 실행됩니다.

#### 2. 백엔드 설정 (선택사항 - 로컬 개발용)

```bash
# backend 디렉토리로 이동
cd backend

# 가상환경 생성 및 활성화
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# 의존성 설치
pip install -r requirements.txt

# 환경 변수 설정 (backend/.env 파일 생성)
GEMINI_API_KEY=your_gemini_api_key_here

# 서버 실행
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

백엔드는 `http://localhost:8000`에서 실행됩니다.

#### 3. PowerShell 스크립트 사용 (Windows)

**터미널 1 (백엔드):**
```powershell
.\start-backend.ps1
```

**터미널 2 (프론트엔드):**
```powershell
.\start-frontend.ps1
```

### Vercel 배포

#### 1. 환경 변수 설정

Vercel 대시보드에서:
1. 프로젝트 → Settings → Environment Variables
2. `GEMINI_API_KEY` 추가 (Google AI Studio에서 발급)

#### 2. 배포

```bash
# Vercel CLI 설치 (처음만)
npm install -g vercel

# 로그인
vercel login

# 배포
vercel --prod
```

또는 GitHub에 연결하여 자동 배포

## 📋 현재 상태

### ✅ 완료된 기능

- [x] PDF 파일 업로드 및 텍스트 추출
- [x] 문장 단위 분리 및 번역
- [x] 다양한 읽기 모드 (나란히, 영어만, 한글만, 토글)
- [x] 다크 모드 지원
- [x] 반응형 디자인
- [x] Vercel Serverless Functions 배포
- [x] 헤더 아이콘 연결 (도움말, 설정)

### 🔧 기술 스택

**프론트엔드:**
- React 19.2.0
- Vite 7.3.0
- React Router 7.11.0
- Tailwind CSS 3.4.19
- PDF.js 4.10.38

**백엔드:**
- Vercel Serverless Functions (Node.js)
- Google Gemini AI (gemini-2.0-flash)
- Python FastAPI (로컬 개발용)

## 🐛 오류 및 극복 현황

### 1. PDF.js Worker 파일 오류 ✅ 해결

**문제:**
- CDN에서 PDF.js worker 파일을 로드할 때 오류 발생
- `Source file not found: pdf.worker.min.js` 에러

**해결:**
- `node_modules/pdfjs-dist`에서 worker 파일을 `public/` 폴더로 복사
- `scripts/copy-pdf-worker.js` 스크립트 추가
- `npm install` 시 자동 복사 (`postinstall` 스크립트)
- CDN 의존성 제거, 로컬 파일 사용

**파일:**
- `scripts/copy-pdf-worker.js`
- `package.json` (postinstall 스크립트)

### 2. Vercel 빌드 오류 ✅ 해결

**문제:**
- `vite: command not found` 에러
- `Cannot find module 'tailwindcss'` 에러

**해결:**
- `package.json`에 모든 의존성 명시
- `package-lock.json` 정리
- 빌드 명령어에 `npm run copy-pdf-worker` 추가

### 3. Vercel API 404 오류 ✅ 해결

**문제:**
- `/api/translate` 엔드포인트에서 404 Not Found
- Vercel Serverless Functions 인식 실패

**해결:**
- `api/translate.js` 파일을 프로젝트 루트에 배치
- `vercel.json` 설정 최적화
- CORS 헤더 추가
- OPTIONS 핸들러 추가

**파일:**
- `api/translate.js`
- `vercel.json`

### 4. Gemini API 모델 오류 ✅ 해결

**문제:**
- `404 models/gemini-1.5-flash is not found for API version v1beta`
- v1beta API에서 gemini-1.5-flash 모델을 찾을 수 없음

**해결:**
- 모델명을 `gemini-2.0-flash`로 변경
- v1 API와 호환되는 최신 모델 사용

**파일:**
- `api/translate.js` (모델명 변경)

### 5. 로컬 개발 환경 404 오류 ✅ 해결

**문제:**
- 로컬에서 `/api/translate` 호출 시 404 오류
- Vite 개발 서버에서 API 엔드포인트 접근 불가

**해결:**
- `vite.config.js`에 프록시 설정 추가
- 로컬 개발 시 Python 백엔드 사용
- 또는 `vercel dev`로 로컬 Serverless Functions 테스트

**파일:**
- `vite.config.js` (프록시 설정)

### 6. CORS 오류 ✅ 해결

**문제:**
- 브라우저에서 CORS 정책 위반 오류

**해결:**
- `api/translate.js`에 CORS 헤더 추가
- `vercel.json`에 CORS 헤더 설정
- OPTIONS 메서드 핸들러 추가

**파일:**
- `api/translate.js`
- `vercel.json`

### 7. LF/CRLF 경고 ✅ 해결

**문제:**
- Git에서 `LF will be replaced by CRLF` 경고

**해결:**
- `git config core.autocrlf true` 설정 (Windows)
- 또는 `.gitattributes` 파일로 통일

## 📝 환경 변수

### 프론트엔드 (.env)

```env
VITE_API_URL=http://localhost:8000  # 로컬 개발용
# Vercel 배포 시에는 /api 사용 (같은 도메인)
```

### 백엔드 (backend/.env)

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Vercel 환경 변수

- `GEMINI_API_KEY`: Google AI Studio에서 발급받은 API 키

## 🔧 개발 스크립트

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview

# PDF worker 파일 복사
npm run copy-pdf-worker

# 린트 검사
npm run lint
```

## 📚 API 엔드포인트

### POST /api/translate

PDF에서 추출한 문장들을 번역합니다.

**요청:**
```json
{
  "sentences": [
    "The role of AI in modern science is significant.",
    "This requires interdisciplinary collaboration."
  ]
}
```

**응답:**
```json
{
  "status": "success",
  "totalSentences": 2,
  "processedCount": 2,
  "data": [
    {
      "id": 1,
      "english": "The role of AI in modern science is significant.",
      "korean": "현대 과학에서 AI의 역할은 중요하다."
    },
    {
      "id": 2,
      "english": "This requires interdisciplinary collaboration.",
      "korean": "이는 학제 간 협력을 요구한다."
    }
  ]
}
```

## 🛠️ 문제 해결

### "Failed to fetch" 오류

1. 백엔드 서버가 실행 중인지 확인 (`http://localhost:8000/api/health`)
2. 환경 변수 `VITE_API_URL` 확인
3. 브라우저 콘솔에서 정확한 에러 메시지 확인

### "uvicorn이 인식되지 않습니다"

```powershell
cd backend
.\venv\Scripts\Activate.ps1
```

### PDF 텍스트 추출 실패

- 텍스트 기반 PDF만 지원합니다 (이미지 스캔 PDF는 지원하지 않음)
- PDF 파일이 손상되지 않았는지 확인

### Gemini API 오류

- API 키가 올바르게 설정되었는지 확인
- [Google AI Studio](https://makersuite.google.com/app/apikey)에서 API 키 발급
- Vercel 환경 변수에 `GEMINI_API_KEY` 설정 확인

## 📄 라이선스

MIT

## 🙏 감사의 말

- [Google Gemini AI](https://ai.google.dev/) - 번역 AI
- [PDF.js](https://mozilla.github.io/pdf.js/) - PDF 텍스트 추출
- [Vercel](https://vercel.com/) - 배포 플랫폼
     
