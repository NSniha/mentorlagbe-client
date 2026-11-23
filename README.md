<div align="center">

# MentorLagbe Client

**The web client for MentorLagbe, a mentorship platform that helps learners find and connect with mentors.**

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Better Auth](https://img.shields.io/badge/Better_Auth-1F1F1F?style=flat-square)
![Motion](https://img.shields.io/badge/Motion-0055FF?style=flat-square&logo=framer&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

[Live Demo](https://mentorlagbe-client-eight.vercel.app) | [Report a Bug](https://github.com/NSniha/mentorlagbe-client/issues) | [Request a Feature](https://github.com/NSniha/mentorlagbe-client/issues)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Author](#author)

---

## Overview

MentorLagbe (Bangla for "I need a mentor") is a mentorship platform designed to make it easier for people to find guidance and learn from experienced mentors. This repository contains the **client application**: the user-facing web interface built with the Next.js App Router and TypeScript.

The client is intentionally decoupled from the backend. It communicates with a separate API service, which keeps the interface, business logic and data layer independent and easier to maintain.

## Live Demo

The application is deployed on Vercel:

**https://mentorlagbe-client-eight.vercel.app**

## Key Features

- **Secure authentication** powered by the Better Auth client, handling sign-in and session management against the backend API.
- **Modern App Router architecture** built on Next.js 16, taking advantage of layouts, nested routes and server and client components.
- **Fully typed codebase** written in TypeScript for safer refactoring and better developer experience.
- **Responsive, utility-first styling** with Tailwind CSS 4, designed to work across mobile, tablet and desktop screens.
- **Smooth interface animations** using Motion for transitions and micro-interactions.
- **Consistent iconography** through Lucide, a lightweight and customizable icon set.
- **Clear user feedback** via Sonner toast notifications for success, error and status messages.
- **Environment-driven API configuration**, so the same build can target local, staging or production backends.

## Tech Stack

| Category | Technology | Purpose |
| --- | --- | --- |
| Framework | [Next.js 16](https://nextjs.org/) (App Router) | Routing, rendering and application structure |
| Language | [TypeScript](https://www.typescriptlang.org/) | Static typing and maintainability |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first, responsive styling |
| Authentication | [Better Auth](https://www.better-auth.com/) (client) | User authentication and session handling |
| Animation | [Motion](https://motion.dev/) | UI transitions and animations |
| Icons | [Lucide](https://lucide.dev/) | Icon library |
| Notifications | [Sonner](https://sonner.emilkowal.ski/) | Toast notifications |
| Hosting | [Vercel](https://vercel.com/) | Deployment and hosting |

## Architecture

```
  Browser
     |
     v
  MentorLagbe Client  (Next.js 16, this repository)
     |
     |  requests via NEXT_PUBLIC_API_URL
     v
  MentorLagbe API  (separate service, runs on port 5000 locally)
```

This repository only contains the client. The API must be running separately for authentication and data-driven features to work.

## Getting Started

### Prerequisites

- Node.js 20.9 or later
- npm (comes with Node.js)
- The MentorLagbe API running locally on port `5000`

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/NSniha/mentorlagbe-client.git
   cd mentorlagbe-client
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy the example file to create your local environment file.

   macOS / Linux:

   ```bash
   cp .env.local.example .env.local
   ```

   Windows (Command Prompt):

   ```bash
   copy .env.local.example .env.local
   ```

   Then open `.env.local` and set `NEXT_PUBLIC_API_URL` to the address of your running API.

4. **Start the API server**

   Run the MentorLagbe API separately so it is available on port `5000`.

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open the app**

   Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Yes | Base URL of the MentorLagbe API the client connects to (for local development, the API runs on port `5000`) |

> Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Never place secrets in them.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the development server at `http://localhost:3000` |
| `npm run build` | Creates an optimized production build |
| `npm run start` | Runs the production build locally |

## Project Structure

```
mentorlagbe-client/
├── src/                  # Application source code
├── .gitignore
├── next-env.d.ts         # Next.js TypeScript declarations
├── next.config.ts        # Next.js configuration
├── package.json          # Dependencies and scripts
├── package-lock.json
├── postcss.config.mjs    # PostCSS configuration (Tailwind CSS)
├── tsconfig.json         # TypeScript configuration
└── README.md
```

## Deployment

The client is deployed on [Vercel](https://vercel.com/). To deploy your own instance:

1. Fork or import this repository into Vercel.
2. Add the `NEXT_PUBLIC_API_URL` environment variable in the Vercel project settings, pointing to your deployed API.
3. Deploy. Vercel detects Next.js automatically and configures the build.

## Contributing

Contributions, issues and feature requests are welcome.

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request.

## Author

**Nobonita Saha**
Front-End Developer

- GitHub: [@NSniha](https://github.com/NSniha)
- LinkedIn: [Nobonita Saha](https://www.linkedin.com/in/nobonita-saha-niha-04b501214/)

---

<div align="center">

If you find this project useful, consider giving it a star.

</div>
