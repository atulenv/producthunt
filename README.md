# Tourist Safety Companion

An Expo / React Native experience that helps travellers stay situationally aware with quick emergency actions, live incident overlays, trusted contacts, and offline-ready checklists. Everything is built with Expo Router so navigation remains simple.

## Features

- **Permission gate** that ensures location + notification access before entering the dashboard.
- **Live safety dashboard** with map overlays for nearby alerts, safe zones (embassy, hospital, police), and user position.
- **Quick emergency actions** to dial 112, broadcast the current map link, or navigate to the nearest safe spot.
- **Data-driven cards** showing risk metrics, prep checklists, trusted contacts, and verified local hotlines backed by `src/lib/safety-data.ts`.
- **Reusable UI helpers** (cards, sections, chips) that keep the design cohesive and easy to extend.

## Project structure

- `app/` – Expo Router screens (`index.tsx` permission gate, `home.tsx` dashboard).
- `components/` – Shared UI (pressable tabs, themed wrappers) you can extend.
- `src/lib/safety-data.ts` – Mock data powering alerts, safe spots, metrics, checklists, and resources. Replace these with a backend/API when ready.
- `hooks/` & `constants/` – Theme helpers from the Expo starter template.

## Development

1. Install dependencies

   ```bash
   npm install
   ```

2. Run the Expo dev server

   ```bash
   npx expo start
   ```

   > The `npm start` script now probes whether the environment allows opening a local TCP port.
   > In restricted sandboxes (like this coding environment) the probe will log a warning and exit gracefully;
   > on a normal workstation it launches `expo start` as usual.

3. Open the project in Expo Go, iOS simulator, Android emulator, or a development build as needed.

### Customising data quickly

All of the dashboard content lives in `src/lib/safety-data.ts`. Update or replace the mock arrays there to:

- Insert live alerts from your backend.
- Swap emergency phone numbers per market.
- Seed the preparedness checklist with trip-specific actions.

## Resetting the template

Need the blank Expo starter again? Run:

```bash
npm run reset-project
```

This moves the current code into `app-example` and recreates a clean `app` folder.
