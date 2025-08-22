Hostel Management System 🏡
A complete hostel management solution built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It offers dedicated features for both administrators and students, making hostel operations smooth and efficient.

🌟 Features
Admin Features
Student Management: Add, remove, and manage student records with detailed profiles.

Hostel Management: Create and manage hostel entries, including capacity, amenities, and warden details.

Room Management: Keep track of rooms, their type, capacity, and current occupancy.

Room Assignment: Assign or reassign students to rooms and hostels.

Complaint Handling: View, manage, and resolve complaints from students, with comments and status updates.

Dashboard: Get a real-time overview of the entire system.

Student Features
Profile Management: View and update personal details.

Hostel Information: Access hostel details, amenities, and warden contact info.

Room Information: View assigned room details and amenities.

Complaint System: Submit, track, and comment on complaints related to:

Mess food quality and service

Electricity and power issues

Security and safety concerns

Medical emergencies

Maintenance and repairs

Dashboard: Personal summary with hostel and room details.

Core Highlights
JWT Authentication: Secure role-based login system.

Role-based Access Control: Different interfaces and permissions for admin and student roles.

Responsive Design: Works across desktop, tablet, and mobile devices.

Real-time Updates: Data updates instantly without refreshing the page.

Search & Filter: Advanced tools to find and manage data quickly.

Modern UI: Clean and intuitive design with smooth animations.

🛠️ Tech Stack
Backend
Node.js: Server runtime

Express.js: Web framework

MongoDB: Database with Mongoose ODM

JWT: Authentication & authorization

bcryptjs: Password hashing

CORS: Cross-origin support

Frontend
React.js: UI library

React Router: Client-side routing

React Query: Data fetching & caching

React Hook Form: Form handling

Tailwind CSS: Utility-first styling

Lucide React: Icon set

React Hot Toast: Notifications

📁 Project Structure
Bash

hostel-management/
├── client/                     # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── Admin/          # Admin-specific components
│   │   │   ├── Common/         # Shared components
│   │   │   └── Student/        # Student-specific components
│   │   ├── pages/              # Page components
│   │   │   ├── Admin/          # Admin pages
│   │   │   ├── Student/        # Student pages
│   │   │   └── Auth/           # Authentication pages
│   │   ├── utils/              # Helpers and contexts
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/                     # Node.js/Express backend
│   ├── config/                 # DB configuration
│   ├── controllers/            # API logic
│   ├── middlewares/            # Custom middlewares
│   ├── models/                 # Database schemas
│   ├── routes/                 # API endpoints
│   ├── .env                    # Environment variables
│   ├── package.json
│   └── server.js
└── README.md
🚀 Installation & Setup
Requirements
Node.js (v14+)

MongoDB (v4.4+)

npm or yarn

Backend Setup
Go to the server folder:

Bash

cd hostel-management/server
Install dependencies:

Bash

npm install
Create a .env file with the following:

Code snippet

NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hostel-management
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
Start MongoDB.

Run the server:

Bash

# Development
npm run dev

# Production
npm start
Frontend Setup
Go to the client folder:

Bash

cd hostel-management/client
Install dependencies:

Bash

npm install
Start the development server:

Bash

npm run dev
Open http://localhost:3000 in your browser.

🔐 Authentication
JWT-based authentication with role-based permissions.

Students log in using their Student ID or email.

Admins log in using their email.

Passwords are stored securely with bcrypt.

JWT tokens are used to manage sessions.

📊 API Routes
Authentication
POST /api/auth/admin/register – Register admin

POST /api/auth/student/register – Register student (admin only)

POST /api/auth/login – Login

GET /api/auth/me – Get current user

Admin
GET /api/admin/dashboard – Dashboard stats

GET /api/admin/students – List all students

DELETE /api/admin/students/:id – Delete student

PUT /api/admin/students/:id/assign-room – Assign room

Hostel
GET /api/hostels – All hostels

GET /api/hostels/:id – Single hostel

POST /api/hostels – Create hostel (admin only)

PUT /api/hostels/:id – Update hostel (admin only)

DELETE /api/hostels/:id – Delete hostel (admin only)

Room
GET /api/rooms – All rooms

GET /api/rooms/:id – Single room

POST /api/rooms – Create room (admin only)

PUT /api/rooms/:id – Update room (admin only)

DELETE /api/rooms/:id – Delete room (admin only)

Complaint
GET /api/complaints – All complaints

GET /api/complaints/:id – Single complaint

POST /api/complaints – Create complaint

PUT /api/complaints/:id – Update complaint (admin only)

POST /api/complaints/:id/comments – Add comment

DELETE /api/complaints/:id – Delete complaint (admin only)

Student
GET /api/student/dashboard – Student dashboard

GET /api/student/profile – Get profile

PUT /api/student/profile – Update profile

💾 Database Models
Admin: Name, email, password, role

Student: Student ID, personal details, course, hostel/room info

Hostel: Name, type, capacity, amenities, warden info, fees

Room: Number, type, capacity, amenities, rent, floor, assigned students

Complaint: Subject, description, category, priority, status, comments, resolution

🔒 Security
JWT authentication

Password hashing with bcrypt

Role-based permissions

Server-side input validation

Comprehensive error handling

CORS configuration

🎨 UI/UX
Modern, professional design with a blue theme.

Fully responsive.

Smooth animations and hover effects.

Clear navigation with role-specific layouts.

Real-time form validation.

Loading indicators and skeleton screens.

Toast notifications for feedback.

🚀 Deployment
Production Build
Bash

# Build frontend
cd client && npm run build

# Start backend
cd ../server && npm start
Production .env
Code snippet

NODE_ENV=production
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRE=7d
🤝 Contributing
Fork the repo

Create a feature branch

Commit your changes

Push to your branch

Open a Pull Request

📝 License
MIT License – see LICENSE file for details.

👨‍💻 Developer
Built with ❤️ by dwdjitendra

📞 Support
Open an issue in the repo or contact via LinkedIn.

🔄 Version History
v1.0.0 – Initial release

Auth system

Dashboards

Hostel & room management

Complaint system with live updates

Modern, responsive UI

🎯 Future Plans
Email notifications for complaints

File uploads for complaints

Advanced analytics

Mobile app version

Payment gateway integration

Auto room allocation

Visitor management

Maintenance scheduling

This system is designed for educational institutions, offering a complete, user-friendly solution for hostel operations, student records, and complaint management.
