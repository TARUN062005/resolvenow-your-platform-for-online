
🛠️ ResolveNow: Complaint Management System
A full-stack complaint management platform designed to streamline public grievance redressal. With role-based access and real-time tracking, ResolveNow enables users to register issues, agents to resolve them, and admins to manage the entire lifecycle—efficiently and transparently.

🚀 Features
👥 Role-Based Access (Admin, Agent & User Dashboards)

📝 Complaint Registration, Tracking & Chat Support

👨‍🔧 Agent Assignment with Real-Time Stats

📈 Admin Dashboard with Performance Analytics

💬 In-App Chat System (User ↔ Agent)

⚙️ Status Updates: Pending / In Progress / Completed

📲 Fully Responsive UI (Mobile + Web Friendly)

🛠️ Tech Stack
Frontend: React.js, Axios, Bootstrap, Material UI, React Icons, React Router, Toastify

Backend: Node.js, Express.js, MongoDB + Mongoose, Bcrypt, Body-Parser

Authentication: JWT (Token-based authentication)

Architecture: RESTful APIs

State Management: LocalStorage-based sync for real-time updates

📸 Screenshots
Add your UI screenshots below:

🏠 Home Page

🛠️ Admin Dashboard

👨‍🔧 Agent View

💬 Chat Interface

⚙️ Installation & Setup
Clone the repository

bash
Copy
Edit
git clone https://github.com/your-username/resolvenow-app.git
cd resolvenow-app
Install dependencies

bash
Copy
Edit
npm install
Set up environment variables
Create a .env file in the root directory and add:

env
Copy
Edit
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
Start the development server

bash
Copy
Edit
npm start
🧪 Testing
To run tests for both frontend and backend:

bash
Copy
Edit
npm test
🧠 Agent Statistics Logic
Assigned: Increases when an admin assigns a complaint

In Progress: Automatically calculated as Assigned - Completed

Completed: Increases when an agent marks a complaint as resolved

Note: Each complaint is assigned to only one agent.

📌 Future Enhancements
📱 Mobile App Version

📆 Calendar View for Admins & Agents

🔔 Push Notification Support

🌐 Multi-Language UI

💳 Payment Integration for Paid Services

📤 Export Complaints to PDF

🐞 Known Issues
Minor UI glitches on very small screens

No calendar integration yet

Limited data visualizations in analytics

🤝 Contributing
We welcome contributions!
Fork the repo, make changes, and submit a Pull Request 🚀

📄 License
This project is licensed under the Smart Bridge.

🔗 Resources
📂 Google Drive vedio - https://drive.google.com/file/d/1G4_cL2F6c9Z4ojI2DGoj_bJijRL6guF6/view?usp=sharing


