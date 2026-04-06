# Datadog RUM Without Limits (RWOL) Demo App

RUM, APM, Logs가 통합된 End-to-End 데모 환경입니다.
워크샵에서 사용한 앱을 로컬에서 직접 실행할 수 있습니다.

## Architecture

```
Browser (React + Vite)          Express Backend
┌──────────────────┐           ┌──────────────────┐
│  RUM SDK          │  ──XHR──▶│  dd-trace (APM)   │
│  Browser Logs SDK │           │  winston (Logs)   │
│  Session Replay   │           │  → DummyJSON API  │
└──────────────────┘           └──────────────────┘
        │                              │
        ▼                              ▼
   Datadog RUM                  Datadog Agent
   (direct to DD)               (traces + logs)
```

## Prerequisites

- Node.js 20+
- Docker (for Datadog Agent)
- Datadog account with API Key, App Key, RUM Application

## Quick Start

### 1. Clone & Install

```bash
git clone git@github.com:whiwon-cho/datadog-rwol-sandbox.git
cd datadog-rwol-sandbox
git checkout workshop-v2

cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

### 2. Configure Environment

```bash
cp frontend/.env.example frontend/.env
```

`frontend/.env`를 편집하여 Datadog credentials를 입력:

```
REACT_APP_APP_ID_RUM=<your-rum-application-id>
REACT_APP_CLIENT_TOKEN_RUM=<your-client-token>
```

RUM Application은 Datadog UI → Digital Experience → RUM → Setup & Configurations → New Application에서 생성할 수 있습니다.

### 3. Start Datadog Agent (Docker)

```bash
docker run -d --name dd-agent \
  -e DD_API_KEY=<your-api-key> \
  -e DD_SITE=datadoghq.com \
  -e DD_APM_ENABLED=true \
  -e DD_APM_NON_LOCAL_TRAFFIC=true \
  -e DD_LOGS_ENABLED=true \
  -e DD_HOSTNAME=rwol-demo-local \
  -e DD_TAGS="env:rwol-workshop" \
  -p 8126:8126 \
  -v /var/log/backend:/var/log/backend:ro \
  gcr.io/datadoghq/agent:7
```

### 4. Start the App

**Frontend** (port 5173):
```bash
cd frontend
npx vite --host 0.0.0.0 --port 5173
```

**Backend** (port 3001):
```bash
cd backend
node server.js
```

Open http://localhost:5173

## Enabling RUM & APM

앱은 기본적으로 RUM/APM이 비활성화된 상태로 시작됩니다.

### Enable RUM

```bash
cp solutions/datadog.js frontend/src/datadog.js
```

Frontend를 재시작하면 RUM + Browser Logs + Session Replay가 활성화됩니다.

### Enable APM + Backend Logs

```bash
cp solutions/server-instrumented.js backend/server.js
```

Backend를 재시작하면 APM tracing + winston logging이 활성화됩니다.

## What You'll See in Datadog

| Product | Where | What |
|---|---|---|
| RUM | Digital Experience → Sessions | User sessions, Core Web Vitals, Session Replay |
| APM | APM → Traces | Backend Express routes, outbound HTTP calls |
| Backend Logs | Logs → `service:rwol-demo-backend` | JSON logs with `dd.trace_id` (linked to APM) |
| Browser Logs | Logs → `source:browser` | Client-side logs (linked to RUM sessions) |

Full trace: **RUM Session → APM Trace → Backend Logs** all connected by trace ID.

## Traffic Generation (Optional)

Playwright 스크립트로 자동 트래픽 생성:

```bash
cd frontend
npm install playwright
npx playwright install --with-deps chromium
npx tsx automation-measure.js
```

## File Structure

```
├── frontend/              React app (Vite + Tailwind CSS v4)
│   ├── src/
│   │   ├── datadog.js     RUM SDK config (stub → copy solution to enable)
│   │   ├── pages/         App pages including Diagnostics
│   │   └── ...
│   └── .env               Datadog credentials (create from .env.example)
├── backend/               Express server
│   └── server.js          Basic server (copy solution to enable APM)
├── solutions/             Pre-configured files
│   ├── datadog.js         Full RUM + Logs SDK initialization
│   └── server-instrumented.js  Express + dd-trace + winston
└── dashboards/            Importable Datadog dashboard JSON files
```
