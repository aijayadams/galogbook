This is a [Next.js](https://nextjs.org) project.

## Quick Start

Install deps and run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Build and Run

Build for production and start the server:

```bash
npm run build
npm start
```

## Running the CLI

The project includes a small CLI.

Examples:

```bash
# Say hello
npm run cli -- hello Scott

# Extract fuel data from a PDF invoice
npm run cli -- run ./data/Invoice_09012025.pdf
```

## JPI File Parsing (decodejpi)

The JPI parser (`decodejpi`) is listed as a dependency and is built automatically after `npm install`.

If you ever need to rebuild it manually:

```bash
(cd node_modules/decodejpi && npm run build)
```

Use the app: upload a JPI file on the New Trip page, or POST to the API:

```bash
curl -X POST http://localhost:3000/api/create-trip \
  -F "jpiFile=@/absolute/path/to/U250901.JPI" \
  -F 'flights='
```

Notes:
- The app dynamically loads `decodejpi`. If the lib is unavailable, JPI endpoints return a helpful error.
- When a JPI file is provided and no `flights` JSON is sent, the trip’s flights are derived from the JPI file (default category `ASEL`).

## Airports Dataset (From/To inference)

This app can infer From/To by matching JPI start/end coordinates to the nearest airport.

- Default dataset: embedded JSON at `src/lib/airports.json` (committed).
- Comprehensive dataset override: place a JSON file at `data/airports.json` (git‑ignored) or set `AIRPORTS_JSON_PATH` to an absolute path. Structure:

```json
[
  { "icao": "KSFO", "iata": "SFO", "name": "San Francisco Intl", "lat": 37.6213, "lng": -122.379 },
  { "icao": "KHWD", "iata": "HWD", "name": "Hayward Executive", "lat": 37.659, "lng": -122.122 }
]
```

Tips:
- Convert datasets such as OurAirports/OpenFlights to this JSON shape:

```bash
# OurAirports airports.csv -> src/lib/airports.json
npm run airports:convert -- ./airports.csv

# Or specify a different destination
npm run airports:convert -- ./airports.csv ./data/airports.json
```
  - Accepts CSV (with headers) or JSON. Tries to read `ident`/`iata_code`/`name`/`latitude_deg`/`longitude_deg` fields.
- Matching uses a 10 km cutoff; if no airport is within 10 km, From/To remains blank.
