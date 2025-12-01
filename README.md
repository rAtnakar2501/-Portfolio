
# Kali Linux Portfolio Website

A full-featured, interactive portfolio website styled like the **Kali Linux** operating system interface.  
This web application includes user authentication, project showcasing, and a fully functional **Snake game** – all with a terminal-style aesthetic.

![Kali Linux](https://img.shields.io/badge/Kali-Linux-557CF2?style=for-the-badge&logo=kalilinux&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-2.3.3-000000?style=for-the-badge&logo=flask&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)

---

## 🎮 Live Demo Features

- 🐉 **Kali Linux Authentic Interface** – Boot-style loading screen and terminal-like UI  
- 🔐 **User Authentication System** – Register, login, and manage your profile  
- 📊 **Interactive Dashboard** – Project showcase with dynamic content  
- 🐍 **Playable Snake Game** – Classic Snake with score + high score tracking  
- 📄 **Resume Download** – Downloadable PDF resume from the UI  
- 📱 **Responsive Design** – Optimized for desktop and mobile

---

## 🚀 Quick Start

### ✅ Prerequisites

- Python **3.8+**
- `pip` package manager

### 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/<your-username>/kali-portfolio.git
   cd kali-portfolio
   ```

2. **Create & activate virtual environment** (optional but recommended)

   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Linux/macOS
   source venv/bin/activate
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**

   ```bash
   python app.py
   ```

5. **Open in browser**

   Go to: [http://localhost:5000](http://localhost:5000) or IF you want to see how its look you can go to ()

---

## 📁 Project Structure

```text
kali-portfolio/
├── app.py                 # Main Flask application
├── database.py            # Database operations and models
├── requirements.txt       # Python dependencies
├── static/
│   ├── css/
│   │   └── style.css      # All CSS styles (including game styles)
│   ├── js/
│   │   └── script.js      # All JavaScript (including Snake game)
│   └── assets/
│       └── resume.pdf     # Resume file (or placeholder)
└── templates/
    ├── base.html          # Base template
    ├── login.html         # Login page
    ├── register.html      # Registration page
    └── dashboard.html     # Main dashboard with all features
```

---

## 🎯 Features in Detail

### 1. 🔐 Authentication System

- Secure user registration with **password hashing**
- Session-based login/logout
- **SQLite** database for user storage
- Flash messages for user feedback

### 2. 🖥️ Kali Linux Interface

- **Loading Screen:** Fake Kali Linux boot sequence
- **Terminal Windows:** Resizable/minimizable terminal-style panels
- **Menu Bar:** Top navbar with system info and logout
- **Sidebar:** Navigation + quick actions
- **Theme:** Dark, terminal-style Kali-like color scheme

### 3. 💼 Project Showcase

- Interactive project cards with **status indicators**
- Technology tags for each project
- “See More Projects” dynamic loading
- Detailed descriptions and tech stack per project

### 4. 🐍 Snake Game

Features:

- Full keyboard controls (arrow keys)
- Score + **high score tracking** (using `localStorage`)
- Increasing game speed as the snake grows
- Pause/Resume functionality
- Game Over screen with replay option

Controls:

- `↑ ↓ ← →` – Move snake  
- `P` – Pause / Resume  
- `R` – Reset  
- On-screen buttons: **Start / Pause / Reset**

### 5. 📄 Additional Features

- **Resume Download:** Direct download of your resume in PDF format
- **Profile Section:** Display user details
- ⏱️ Real-time system clock in menu bar
- Typing-style animations and hover effects
- Fully responsive layout

---

## 🛠️ Tech Stack

### Backend

- **Flask 2.3.3** – Python web framework
- **SQLite** – Lightweight relational database
- **Werkzeug** – Security utilities

### Frontend

- **HTML5** – Semantic structure  
- **CSS3** – Custom styling + animations  
- **JavaScript (ES6)** – Interactive behaviors  
- **Canvas API** – Snake game rendering

### Security

- Password hashing with **SHA-256**
- Session management
- Basic SQL injection protection
- Input validation

---

## 🐍 Snake Game Implementation

The Snake game is implemented using:

- Object-Oriented JavaScript (**ES6 classes**)
- HTML5 **Canvas** for drawing
- Game loop with `setInterval`
- Collision detection for:
  - Walls
  - Self-body
- High score stored using `localStorage`

---

## 📱 Usage Guide

### First-Time Setup

1. Start the Flask server:

   ```bash
   python app.py
   ```

2. Open [http://localhost:5000](http://localhost:5000)

3. Click **“Register”** to create a new account

4. Login with your credentials

5. Explore the dashboard and launch the **Snake game** from the sidebar

### Playing Snake

- Open the **“Snake Game”** tab from the sidebar  
- Press any arrow key or click **“START GAME”**  
- Eat the red food blocks to grow and gain points  
- Avoid hitting the wall or your own body  
- `P` or **“PAUSE”** to pause  
- `R` or **“RESET”** to restart

### Managing Projects

- Go to the **“Projects”** tab
- View all available projects
- Click **“See More Projects”** to load additional entries
- Each card shows:
  - Name
  - Description
  - Status
  - Tech stack tags

---

## ⚙️ Configuration

### Change Secret Key

In `app.py`:

```python
app.secret_key = 'your-new-secret-key-here'
```

### Add Your Real Resume

Replace the placeholder:

```text
static/assets/resume.pdf
```

with your actual resume file.

### Customize Projects

In `app.py` (or a config file), edit:

```python
projects = [
    {
        'id': 1,
        'name': 'Your Project',
        'description': 'Project description',
        'tech': ['Technology1', 'Technology2'],
        'status': 'Completed'
    },
    # Add more projects...
]
```

### Game Settings

In `static/js/script.js`:

```javascript
this.gridSize = 20;      // Game grid size
this.gameSpeed = 120;    // Initial game speed (lower = faster)
```

Tune these to change game difficulty.

---

## 🔒 Security Notes

This project is configured in **development mode**.

For production:

- Change the secret key to a strong random value
- Disable debug mode:

  ```python
  app.run(debug=False)
  ```

- Use a production WSGI server (Gunicorn, uWSGI, etc.)
- Enable HTTPS (reverse proxy with Nginx/Apache)
- Consider a more robust DB (PostgreSQL, MySQL)
- Add stronger validation & CSRF protection

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Change port in app.py
app.run(port=5001)
```

### Database Errors

```bash
# Remove old database and restart
rm database.db
python app.py
```

### Game Not Loading

- Check browser console (`F12`) for JavaScript errors
- Verify all JS files are correctly linked
- Clear browser cache and hard refresh (`Ctrl + Shift + R`)

### Styles Not Applying

- Ensure correct CSS paths in templates
- Hard refresh (`Ctrl + Shift + R`)

---

## 🌐 Browser Compatibility

- ✅ Chrome 60+  
- ✅ Firefox 55+  
- ✅ Safari 11+  
- ✅ Edge 79+  

---

## 📈 Future Enhancements

Planned / potential features:

- User avatar upload
- Project comments and ratings
- Multiplayer Snake mode
- Dark/Light mode toggle
- More terminal-style games (Tetris, Space Invaders, etc.)
- Project filtering and search
- Export project data as JSON/PDF
- Admin panel for content management
- REST API for projects

---

## 🤝 Contributing

1. Fork the repository  
2. Create a feature branch:

   ```bash
   git checkout -b feature-name
   ```

3. Commit your changes:

   ```bash
   git commit -m "Add feature"
   ```

4. Push to your branch:

   ```bash
   git push origin feature-name
   ```

5. Open a **Pull Request**

---

## 📄 License

This project is open source and available under the **MIT License**.

---

## 🙏 Acknowledgments

- Inspired by the **Kali Linux** interface  
- Snake game based on classic implementations  
- Flask documentation and community resources  
- All contributors and testers

---

## 📞 Support

For issues, questions, or suggestions:

- Check the **Troubleshooting** section above  
- Open an **issue** in this repository  
- Or contact the maintainer directly

> 💻 Happy Coding! Enjoy the Kali Linux experience… and don’t forget to feed your snake 🐍
