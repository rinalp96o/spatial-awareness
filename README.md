# Spatial Awareness Game

Frontend-only spatial awareness game built with React + TypeScript + Vite.

## Local development

```bash
npm install
npm run dev
```

## Build and lint

```bash
npm run lint
npm run build
```

## Google Sheets result logging (Apps Script)

The app can log one row to Google Sheets on each guided-level submission with:
- `level` (for example `Level 1`)
- `result` (`success` or `failure`)
- `name`
- `age`
- `gender`

### 1) Configure webhook URL in frontend

1. Copy `.env.example` to `.env`.
2. Set:

```bash
VITE_RESULTS_WEBHOOK_URL="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
```

If this value is empty, logging is skipped gracefully.

### 2) Add Apps Script to your sheet

Open the target sheet, then `Extensions -> Apps Script`, and paste:

```javascript
function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents || '{}');
    var level = payload.level || '';
    var result = payload.result || '';
    var name = payload.name || 'N/A';
    var age = payload.age || 'N/A';
    var gender = payload.gender || 'N/A';
    var timestamp = payload.timestamp || new Date().toISOString();

    // Uses first sheet tab by default.
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Optional: write header row once.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['timestamp', 'level', 'result', 'name', 'age', 'gender']);
    }

    sheet.appendRow([timestamp, level, result, name, age, gender]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### 3) Deploy Apps Script as Web App

1. Click `Deploy -> New deployment`.
2. Select type: `Web app`.
3. Execute as: `Me`.
4. Who has access: `Anyone with the link`.
5. Deploy and copy the Web App URL.
6. Put that URL into `VITE_RESULTS_WEBHOOK_URL`.

### 4) Verify end-to-end

1. Run app locally with `npm run dev`.
2. Complete a guided level and submit.
3. Confirm a new row appears in your sheet with `timestamp`, `level`, `result`.
