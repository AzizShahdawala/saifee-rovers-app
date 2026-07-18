# Saifee Rovers Attendance

Responsive member, event, face-enrollment, attendance, and reporting application built with React, Vite, and Material UI.

## Features

- Responsive authenticated dashboard and navigation
- Member registration, editing, filtering, and face enrollment
- Event list, card, and calendar views
- Camera-based attendance scanner and manual override
- Attendance analytics with Excel and print-to-PDF export
- Automated GitHub Pages deployment

## Local development

```bash
npm install
npm run dev
```

The frontend uses `http://localhost:5000/api` by default. To connect another backend, create a `.env.local` file:

```env
VITE_API_URL=https://your-api.example.com/api
```

## Quality checks

```bash
npm run lint
npm run build
```

## Deployment

Pushes to `main` are built and deployed by `.github/workflows/deploy-pages.yml`.

Live site: https://azizshahdawala.github.io/saifee-rovers-app/

For production API connectivity, configure the repository Actions variable `VITE_API_URL`.
