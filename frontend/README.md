# ReachInbox — Frontend

Production-ready admin dashboard for the ReachInbox cold email outreach platform.

## Tech Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS v4
- Axios
- React Router DOM
- Sonner (toasts)

## Getting Started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:3000` and talks to the backend at
`http://localhost:5000/api`.

## Environment Variables

Copy `.env.example` to `.env` and adjust as needed:

| Variable       | Default                  | Description                                                        |
| -------------- | ------------------------ | ------------------------------------------------------------------ |
| `VITE_API_URL` | `http://localhost:5000/api` | Base URL of the ReachInbox backend API.                         |
| `VITE_USER_ID` | _(empty)_                | The user id campaigns are created under (required by the backend for the `campaigns.user_id` foreign key). If left empty, the app infers it from the most recent existing campaign. |

## Scripts

```bash
npm run dev        # Start the dev server
npm run build      # Type-check + production build
npm run preview    # Preview the production build
npm run typecheck  # Run the TypeScript compiler
npm run lint       # Run ESLint
```

## Pages

- `/` — Dashboard with campaign, lead, sent, and pending email totals
- `/campaigns` — Campaign list with start / details / delete actions
- `/campaigns/create` — Create a new campaign
- `/campaigns/:id` — Per-campaign email statistics + start button
- `/leads` — Lead list and add-lead form

## Project Structure

```
src/
  components/
    campaigns/CampaignTable.tsx
    layout/AppLayout.tsx
    layout/Navbar.tsx
    layout/Sidebar.tsx
    leads/LeadTable.tsx
    ui/Button.tsx
    ui/StatCard.tsx
    ui/Loader.tsx
  hooks/
    useCampaigns.ts
    useCampaignStats.ts
    useLeads.ts
  lib/
    config.ts
    cn.ts
    format.ts
  pages/
  services/
    api.ts          # Axios instance + error normalization
    campaigns.ts
    leads.ts
  types/index.ts
```