Note: Currently being refactored and optimised with **unit testing** via Vitest, **CI/CD** via Github Actions and **containerisation** with Docker. <br/>

# 🎓 GradePilot - Academic Progress Tracker
An intelligent, full-stack web application designed to help UK university students track, manage, and predict their academic grades.

## My Problem:
During the exam periods in university, I would always be anxious about my performance in the final exam. I wanted to know exactly what I needed in my exams and coursework to achieve my targets. <br/> <br/> I had to calculate to find out the information myself. This wasn't ideal, I wanted it to be easy and quick to access. <br/> <br/>
I didn't have time back then, but during the breaks I do. I've created an app that solves everything I need. If you find it useful, I don't mind you using it either! (Don't make me pay for a database)

## Tech Stack:
This project is a full-stack application built with the modern, type-safe PERN (PostgreSQL, Express, React, Node.js) stack.

**💻 Front-End:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Router <br/>
**🗃️ Back-End and Database:** Node.js, Express.js, PostgreSQL, Prisma (ORM) Supabase (Hosting), JWT <br/>
**☁️ Deployment:** Vercel (Client), Render (Server) <br/>

## Key Features:
**🛡️ Secure Authentication:** Full user registration and login system using JWT for secure, stateless authentication. <br/>
**📋 Dashboard:** A yearly dashboard that provides an overview of the user's current academic year, modules, and overall progress. <br/>
**🖊️ CRUD Functionality:** Users can create, edit, and delete their modules and the individual assignments within them, providing complete control over the year. <br/>
**✈️ The "Pilot" Engine:** The core feature of the application. The Pilot is a smart calculator and predictor that provides real-time, actionable insights for the user's progress. Exactly what you may need for your own academic peace-of-mind!

[![Live Demo:](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge)](https://grade-pilot-gold.vercel.app/)


## Design:
<img width="1000" height="600" alt="Image" src="https://github.com/user-attachments/assets/89db8825-d007-4829-bcb7-c899f2130ce6" />
Module with no assignments: <br/>
<img width="1754" height="679" alt="Image" src="https://github.com/user-attachments/assets/8a8821bb-2b6e-45b5-8688-603881c99f92" />
Module with assignments added but assignments incomplete: <br/>
<img width="1756" height="984" alt="Image" src="https://github.com/user-attachments/assets/8c531352-95f3-4135-8fa5-5b3f065e4e7f" />
Module with all assignments added and complete: <br/>
<img width="1755" height="957" alt="Image" src="https://github.com/user-attachments/assets/0ae28ca4-f750-4cc0-838f-2d84701e66c8" />
<br/>
Brief Showcase:
https://github.com/user-attachments/assets/41bed0ad-65bb-4bde-941c-f6147bd94ea4


## Project Status:
This project being refactored and optimised with **unit testing** via Vitest, **CI/CD** via Github Actions and **containerisation** with Docker. 
The core functionality for user authentication, data management, and the dashboard is more or less complete.
Future planned features include (time permitted):
A detailed "Overview" page with year-on-year progress to track years at-a-glance.
The ability for users to edit their core degree information after onboarding.
More pilot features!
Support for multiple degree programs per user.



















