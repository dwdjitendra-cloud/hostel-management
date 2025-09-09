# Hostel Management System 🏡

A comprehensive hostel management application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). This project demonstrates expertise in full-stack development, modern UI/UX design, and robust, secure engineering practices. Designed for educational institutions, the system streamlines hostel operations for both administrators and students.

---

## Features

### Admin
- Manage student records with detailed profiles
- Create and manage hostel entries (capacity, amenities, wardens)
- Room management and assignment
- Complaint tracking and resolution with comment threads
- Real-time dashboard for operational overview

### Student
- Manage personal profile
- Access hostel and room details
- Submit, track, and comment on complaints (mess, maintenance, safety, medical, etc.)
- Personalized dashboard

### System-Wide
- Secure JWT authentication with role-based access control
- Real-time updates and notifications
- Advanced search and filtering tools
- Responsive, modern user interface

---

## Tech Stack

- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs
- **Frontend:** React.js, React Router, React Query, React Hook Form, Tailwind CSS, Lucide React, React Hot Toast

---

## Project Structure

```
hostel-management/
├── client/   # React frontend
│   └── src/
│       ├── components/ (Admin, Common, Student)
│       ├── pages/      (Admin, Student, Auth)
│       ├── utils/
│       └── App.jsx, main.jsx
├── server/   # Node.js/Express backend
│   ├── config/, controllers/, middlewares/, models/, routes/
│   ├── .env, server.js
└── README.md
```

---

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (v4.4+)
- npm or yarn

### Backend Setup
```bash
cd hostel-management/server
npm install
# Add a .env file as below
npm run dev   # or npm start for production
```
Sample `.env`:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hostel-management
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
```

### Frontend Setup
```bash
cd hostel-management/client
npm install
npm run dev
```
Access the app at [http://localhost:3000](http://localhost:3000)

---

## Security

- JWT-based authentication and session management
- Passwords securely hashed with bcrypt
- Strict role-based access and server-side validation

---

## API Overview

- **Authentication:** `/api/auth/*`
- **Admin:** `/api/admin/*`
- **Hostel:** `/api/hostels/*`
- **Room:** `/api/rooms/*`
- **Complaint:** `/api/complaints/*`
- **Student:** `/api/student/*`

---

## Code Highlights

- Modular, RESTful API design with comprehensive error handling
- React with modern hooks, state management, and reusable components
- UI/UX with Tailwind CSS, responsive layouts, and smooth user interactions
- Clear and maintainable folder structure

---

## Achievements

- Designed and delivered a full-stack, production-grade application
- Implemented industry-standard security practices
- Prioritized performance, accessibility, and user experience
- Documented and tested all major components

---

## Future Improvements

- Email notifications for key events
- File uploads for complaints
- Advanced analytics and reporting
- Mobile app version
- Payment gateway integration
- Automated room allocation, visitor management, maintenance scheduling

---

## License

MIT License – see LICENSE for details.

---

**Developed by Jitendra** ([@dwdjitendra-cloud](https://github.com/dwdjitendra-cloud))  
For feedback or collaboration, connect via [LinkedIn](https://www.linkedin.com/in/your-linkedin/) or open a GitHub issue.
