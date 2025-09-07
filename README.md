
# GradePilot - Academic Progress Tracker🎓
An intelligent, full-stack web application designed to help UK university students track, manage, and predict their academic grades.

## My Problem:
During last year's exam period, I realised I was always anxious about how well I'd actually do come the final exam. I wanted to know what I needed in the exam and coursework for the targets I had in mind. I wanted to know it easily, track it, without calculating it myself.
I didn't have time back then, but now that I do, I've created an app that solves everything I need. Currently needs the finishing touches, but if you find it useful, I don't mind you using it either! (Don't make me pay for a database)

## Key Features:
**Secure Authentication:** Full user registration and login system using JWT for secure, stateless authentication.
**Dashboard:** A yearly dashboard that provides an overview of the user's current academic year, modules, and overall progress.
**CRUD Functionality:** Users can create, edit, and delete their modules and the individual assignments within them, providing complete control over the year.
**The "Pilot" Engine:** The core feature of the application. The Pilot is a smart calculator and predictor that provides real-time, actionable insights for the user's progress. Exactly what you may need for your own academic peace-of-mind!

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://grade-pilot-gold.vercel.app/)
[![Status](https://img.shields.io/badge/Status-In_Progress-yellow?style=for-the-badge)]()


## Tech Stack
This project is a full-stack application built with the modern, type-safe PERN (PostgreSQL, Express, React, Node.js) stack.

### Front-End:
React, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Router

### Back-End and Database
Node.js, Express.js, PostgreSQL, Prisma (ORM) Supabase (Hosting)

### Auth
JWT (JSON Web Tokens)

### Deployment
Vercel (Client), Render (Server)

## Project Status:
This project is almost done! The core functionality for user authentication, data management, and the dashboard is more or less complete.
Future planned features include:
A detailed "Overview" page with year-on-year progress to track years at-a-glance.
The ability for users to edit their core degree information after onboarding.
More pilot features!
Support for multiple degree programs per user.
