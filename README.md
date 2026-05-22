## G-Web
**G-Web** is a curated collection of lightweight, interactive web-based games and mini-apps. This repository serves as a digital playground featuring classic logic puzzles, arcade staples, and fun utility tools built entirely with modern web technologies.
## What's Inside?
- **2048 Game :** The addictive tile-merging challenge.
- **Snake Game :** A tribute to the legendary Nokia-era classic.
- **Mine Sweeper :** A strategic battle against hidden explosives.
- **Lottery Spin Wheel & Roll Dice :** Interactive tools for games of chance and quick decision-making.  
- **Rol Dice :** - A simple, physics-based randomizer for tabletop gaming and quick bets.
- **Simple X-O :** - The timeless strategy of Tic-Tac-Toe, perfect for a quick mental workout.
- **Ping-Pong Game :** - A fast-paced test of reflexes inspired by the classic arcade era.
- **Chess Game :** - The ultimate board game of logic, foresight, and tactical mastery.
- **Modern Tetris Game :** - A sleek, updated version of the world's most famous block-stacking puzzle.
- **Breakout Game :** - Breakout is a classic arcade game where the player controls a paddle to bounce a ball and destroy all the bricks on the screen.

---
## Technical Overview
The project is designed with a ==Mobile First== approach, ensuring a seamless experience across desktops, tablets, and smartphones.
### Frontend Architecture
- **HTML5 & Css3 :** Utilizes semantic tags and advanced *CSS* techniques, including *Flexbox* and *Css Grid*, for a highly responsive layout.
- **Animations :** The UI features immersive entrance animations powered by **CSS Keyframes** *(Slide, Zoom, and Custom Path animations)* to create a premium, ==app-like== feel.
- **Iconography :** Integrated via *Boxicons* for a clean and consistent visual language.
### JavaScript Style & Libraries
The logic layer of the website is built with clean, maintainable, and modern JavaScript. Key features include:
- **Vanilla JS Core :** The main navigation and UI interactions (active scroll menu, mobile toggle) are written in pure JavaScript, avoiding unnecessary heavy frameworks for maximum performance.
- **Event-Driven Programming :** Uses `DOMContentLoaded` listeners and `keyup` events for real-time form validation and UI responsiveness.
- **Asynchronous Communication :** Implements the **Fetch API** to handle non-blocking POST requests, allowing seamless data transfer between the frontend and the backend.
### Backend & Connectivity *(The New Addition)*
The website is powered by a robust **Node.js** environment, transforming it from a static page into a dynamic application:
- **Express.js Framework :** A lightweight backend server handles routing and serves static files across the local network.
- **Network-Aware Hosting :** Features an automated **Internal IP Discovery** system (using the `os` module), allowing anyone on the same Wi-Fi network (students, teachers) to connect via a mobile device or laptop without manual IP lookup.
- **RESTful API :** Includes a dedicated `/contact` endpoint to process form submissions securely.
### Coding Style & Architecture
- **Modular Logic :** Functions are strictly separated by responsibility (e.g., `checkEmail` for validation, `sendEmail` for server-side communication).
- **Security First :** Sensitive operations, such as email credentials and SMTP configurations, are moved to the **Server-Side**, protecting them from being exposed in the browser.
- **Optimized UX :** Implements **Debouncing** on scroll events and provides instant feedback through status-coded responses *(200 OK / 500 Error)*.
### External Libraries
- **Nodemailer :** Integrated into the backend to handle automated email notifications via **Gmail SMTP** using secure **App Passwords**.
- **SweetAlert2 :** For beautiful, responsive, and customizable popup notifications that react to the server's response.
- **Boxicons :** Used for a modern, unified icon set across the UI and Dark Mode toggles.

---
## Development Environment & Tools
This project is built using a modern stack designed for local development and testing.
- **Editor :** [Visual Studio Code](https://code.visualstudio.com/) is used for all development, utilizing extensions for Node.js and Markdown *(for Obsidian compatibility)*.
- **Local Server & Database:**
    - **XAMPP :** Utilized to manage the local environment.
    - **Apache :** Serves as the base layer for local hosting integration.
    - **MySQL :** Manages the relational database structure.
    - **phpMyAdmin :** Used for efficient SQL database administration, schema design, and data management.
- **Backend Runtime :** [Node.js](https://nodejs.org/) powers the server-side logic and API routing.

---
## Setup Instructions
Follow these steps to run the project locally on your machine :
1. **Clone the repository :**
   ```bash
   git clone [https://github.com/Meszaros-Erik/G-Web.git (https://github.com/Meszaros-Erik/G-Web.git)
   ```

2. **Database Setup :** 
    - Open **XAMPP Control Panel** and start **Apache** and **MySQL**.  
    - Navigate to `http://localhost:8080/phpmyadmin/`. 
    - Create a new database and import the SQL structure *(based on the provided diagram in `SQL DataBase.jpg`)*.
3. **Install Dependencies :**
    - Open the project folder in VS Code.
    - Run the following command in the terminal :  
```bash
npm install
```

4. **Environment Configuration :**
    - Ensure your database connection settings in `config/db.js` match your local XAMPP MySQL configuration (default: user `root`, no password).
5. **Start the Application :**  
```bash
node server.js
``` 

- The server will be accessible via `http://localhost:3500` or your local network IP as indicated in the console. 

---
## 📊 System Architecture & UML Diagram 
The system follows a classic **Client-Server architecture**. Below is the UML representation of the database relationships and the data flow between components. 
### Database ER Diagram 
The following diagram illustrates the relational structure of the database, highlighting the connections between `Users`, `Games`, `Scores`, and `Favorites`. 
![Database Schema](SQL%20DataBase.jpg) 
### System Data Flow *(Mermaid UML)* 
You can view the system's logic flow directly within Obsidian using the following Mermaid syntax : ```mermaid graph TD 
A [Frontend: User/Admin Interface] -- Fetch API / POST / DELETE --> B [Express.js-Backend] 
B -- Queries --> C [(MySQL Database)] 
B -- Send Notifications --> D [Gmail SMTP / Nodemailer] 
C -- Returns Data --> B 
B -- JSON Response --> A```