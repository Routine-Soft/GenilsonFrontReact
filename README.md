# CEST Training — Admin panel

Admin panel of the online training platform of **CEST Segurança do Trabalho**, a workplace safety training company. Staff create courses and exams, manage answer keys and check the students' history. A separate developer area manages the access passwords that release exams to students.

![React](https://img.shields.io/badge/react-create--react--app-61DAFB?logo=react&logoColor=black)
![License](https://img.shields.io/badge/license-private-lightgrey)

## Demo

- **Admin panel:** https://app.cestsegtrabalho.com.br
- **API:** https://genilson-next.vercel.app/api (backend in [`genilson-next`](../genilson-next))

### Login
![Login](https://github.com/user-attachments/assets/2c1293ae-740e-40ad-b9b7-df2c17dad748)
### Home
![Home](https://github.com/user-attachments/assets/f28e0af2-bb1b-43f1-a20a-a5063ef7b1aa)
### Options
![Options](https://github.com/user-attachments/assets/a7635561-d02b-4ce6-b622-b6de59448d04)
### Student history
![Student history](https://github.com/user-attachments/assets/5a70b5b5-d9d7-4054-a356-fecc5b2b725e)
### Courses
![Courses](https://github.com/user-attachments/assets/bc9eceef-4b78-4819-a889-e990dfa4e5ce)
### Create course
![Create course](https://github.com/user-attachments/assets/5c2cad49-546c-4a90-98bb-10d5696a83dc)
### Create exam
![Create exam](https://github.com/user-attachments/assets/c561be9b-b96c-4106-b132-3cefd942fb5f)

## Features

- **Login** with JWT.
- **Home** with shortcuts to every section.
- **Courses:** create, edit and list courses with a rich text editor (CKEditor / Quill).
- **Exams and answer keys:** create exams and their answer keys.
- **Student history:** course and exam results, with PDF export (html2pdf).
- **Developer area:** separate login to create and manage access passwords.
- **Installable as an app (PWA).**

## Tech stack

| Area | Technology |
|---|---|
| UI | React (Create React App) |
| Routing | React Router |
| HTTP | axios |
| Editors | CKEditor 5, React Quill |
| Others | jwt-decode, moment, html2pdf.js, react-helmet, react-icons |

## Prerequisites

- **Node.js 26.13.1** (see `.nvmrc`; with nvm, run `nvm use`)
- **npm**
- The API running locally, or the URL of a test API

## Installation

```bash
git clone <repository-url> GenilsonFrontReact
cd GenilsonFrontReact
nvm use
npm install
```

Create a `.env` file (see the next section) and start the dev server:

```bash
npm start
```

The app opens at `http://localhost:3000` (use another port if the API is also running on 3000).

## Configuration (environment variables)

Only public values go here: everything starting with `REACT_APP_` ends up in the browser bundle.

| Variable | Required | Description |
|---|---|---|
| `REACT_APP_API_URL` | Yes | API base URL |

```env
REACT_APP_API_URL=http://localhost:3000/api
```

## Usage

| Command | Description |
|---|---|
| `npm start` | Starts the dev server |
| `npm run build` | Builds the production bundle in `build/` |
| `npm test` | Runs the tests |

## Folder structure

```
GenilsonFrontReact/
├── public/               # index.html, PWA manifest, service worker, icons
└── src/
    ├── App.js            # Routes
    ├── modules/
    │   ├── painel/       # Admin panel: login, home, courses, exams, answer keys, history
    │   ├── desenvolvedor/# Developer area: login and access passwords
    │   ├── senhaAcesso/  # Access password API
    │   └── shared/       # Shared API client
    ├── helps/            # useAuth
    └── utils/            # instalarApp (PWA)
```

Each module follows `<module>.api.js`, `<module>.hooks.js`, `<module>.utils.js` and `components/`.

## Deployment

- Built with `npm run build` and published at https://app.cestsegtrabalho.com.br.
- Set `REACT_APP_API_URL` in the hosting environment before building.

## Contributing

1. Create a branch from `main`: `feature/<name>` (or `fix/<name>`).
2. Keep the module structure (`api`, `hooks`, `utils`, `components`).
3. Write commit messages in Portuguese and open a pull request to `main`.

## License and author

**Private and proprietary.** All rights reserved. Developed for CEST Segurança do Trabalho.

Developed by **Stanley Andrade**.
