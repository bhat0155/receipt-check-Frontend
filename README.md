# Receipt Recall Checker (Frontend) including continous deployment

React/Vite frontend that lets users upload a receipt, extracts purchased items via the backend, and checks them against recent Canadian recall notices.

## Features
- Upload a receipt image and trigger OCR/AI item extraction via the backend
- View detected purchased items and check them against the latest recall data
- See a recent recalls list with links to official notices
- Guided states and error messaging for upload, processing, and recall checks

## Tech Stack
- React 19 + TypeScript + Vite
- Routing: react-router-dom
- UI: Tailwind CSS + DaisyUI

## Project Structure
- `src/App.tsx` – top-level routing and layout
- `src/pages/` – `Homepage`, `FAQPage`, `RecentRecalls`
- `src/states/` – `HomeContext` and types for shared state/actions
- `src/api.ts` – thin client for backend endpoints
- `public/` – static assets served as-is

## Environment Variables
- `VITE_API_BASE_URL` – base URL of the backend (e.g., `http://localhost:4000`)

## Local Setup
1) Install Node 18+ and npm.  
2) `cd receipt-frontend`  
3) `npm install`  
4) Create `.env` with `VITE_API_BASE_URL` pointing to your backend.  
5) `npm run dev` and open the printed localhost URL.

## Run in Production
- Build: `npm run build`
- Preview locally: `npm run preview`
- Deploy the `dist/` output to static hosting and configure SPA rewrites (`/* -> /index.html`).

## API Docs (Backend)
- `POST /api/receipts` – upload receipt image (multipart `file`), returns `ReceiptSession`
- `GET /api/receipts/:id` – fetch session by id
- `POST /api/receipts/:id/check-recalls` – re-run recall matching, returns updated session
- `GET /api/recalls/sample` – list of recent recalls (5-day window)
- `DELETE /api/receipts/:id` – delete a session


## Troubleshooting
- 404s on refresh: ensure your host rewrites all routes to `index.html`.
- CORS errors: verify the backend allows your frontend origin and uses HTTPS in production.
- Empty items after upload: try a clearer receipt photo with full receipt in frame.
- API failing: confirm `VITE_API_BASE_URL` is set correctly and the backend is reachable.


## Author
Ekamsingh Bhatia — https://ekamsingh.ca
