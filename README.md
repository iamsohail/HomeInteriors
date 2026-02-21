# HomeBase

Home interior project management web app for tracking expenses, budgets, timelines, and room progress during home renovation/interior work.

## Tech Stack

- **Framework:** Next.js 15 (App Router) + Turbopack
- **UI:** Tailwind CSS v4 + shadcn/ui + Recharts
- **Backend:** Firebase (Auth, Firestore, Storage)
- **Deployment:** Vercel (auto-deploy on push to main)

## Features

- **Expense Tracker** — DataTable with filters, room/vendor/category breakdowns
- **Budget Planner** — Set room-wise budgets, track actuals vs planned
- **EMI Tracker** — Track loan EMIs with payment schedules
- **Timeline** — 15-phase project timeline with status tracking
- **Room Planner** — Room cards with photos, measurements, and checklists
- **Room Measurements** — Detailed per-element measurements (walls, windows, doors, wardrobes) with dual-unit display (cm + ft/in), photo attachments, and tap-to-copy for vendor sharing
- **Mood Board** — Visual inspiration collection
- **Recommendations** — Bangalore vendor/store recommendations

## Getting Started

```bash
npm install
cp .env.example .env.local  # Add Firebase config
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/(app)/          # Authenticated app routes
│   ├── dashboard/      # Main dashboard
│   ├── expenses/       # Expense tracker
│   ├── budget/         # Budget planner
│   ├── emis/           # EMI tracker
│   ├── rooms/          # Room planner
│   ├── timeline/       # Project timeline
│   ├── mood-board/     # Visual inspiration
│   ├── recommendations/# Vendor recommendations
│   └── settings/       # Project settings
├── app/(auth)/         # Login/auth routes
├── components/
│   ├── rooms/          # Room-specific components
│   ├── shared/         # Shared layout components
│   └── ui/             # shadcn/ui primitives
├── lib/
│   ├── firebase/       # Firebase config, storage utils
│   ├── hooks/          # Custom hooks (useRooms, useExpenses, etc.)
│   ├── providers/      # Context providers
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   └── constants/      # Room measurements, categories
```

## Session Notes

### 2026-02-21 — Room Measurements Feature

**What was added:**
- `MeasurementCategory` and `MeasurementEntry` types (`wall`, `window`, `door`, `wardrobe`, `counter`, `fixture`, `custom`)
- `src/lib/utils/measurements.ts` — cm-to-ft/in conversion, `formatMeasurement()`, per-room category configs, auto-label suggestions
- `src/components/rooms/measurement-form.tsx` — inline form with category selector (icon buttons), dimension inputs with live dual-unit preview, optional photo attachment via camera/gallery, notes field
- `src/components/rooms/measurement-list.tsx` — grouped display by category with tap-to-copy dimension chips, edit/delete actions, photo thumbnails
- `src/components/rooms/room-detail-dialog.tsx` — new tabbed dialog (Measurements + Photos) replacing `RoomPhotosDialog` as the room entry point
- Updated `rooms/page.tsx` — measurement count badge (ruler icon) on room cards, integrated new dialog

**Key design decisions:**
- Input in cm, stored as cm in Firestore, displayed as both cm and ft/in side-by-side (e.g., `305 cm · 10' 0"`)
- Room-specific categories: Kitchen rooms get "Counters/Cabinets", Toilet/Bathroom rooms get "Fixtures"
- Walls use letter labels (Wall A, Wall B), others use numbers (Window 1, Door 1)
- Photo attachments reuse existing `resizeImage` + `uploadFile` pattern from room photos

**What to test:**
- Tap room → dialog with Measurements + Photos tabs
- Add wall/window/door measurements → dual-unit display
- Tap dimension chip → copies to clipboard
- Photo attachment on measurements
- Kitchen room shows "Counter/Cabinet" category
- Photos tab works as before (no regressions)
