# User Management Dashboard

A sophisticated full-stack user management system built with Next.js 15, React 19, and MongoDB.

![User Management Dashboard](./public/placeholder.jpg)
Live Demo : https://user-management-tau-six.vercel.app/

## 🌟 Key Features

- **Advanced Authentication System**
  - Secure JWT-based authentication
  - Role-based access control (Admin, Editor, User)
  - Password hashing with bcrypt
  - Session management

- **Comprehensive User Management**
  - User registration with validation
  - Profile management
  - User status tracking (Active/Inactive)
  - Role assignment and permissions

- **Real-time Analytics Dashboard**
  - Interactive data visualization with Recharts
  - User growth trends
  - Activity monitoring
  - Role distribution analytics
  - Status distribution charts

- **Modern UI/UX**
  - Sleek design with Tailwind CSS
  - Responsive layout for all devices
  - Dark/Light theme support
  - Accessible components using Radix UI primitives

- **Performance Optimized**
  - Server-side rendering for faster page loads
  - Optimized database queries
  - Client-side caching with SWR

## 📊 Analytics & Reporting

The dashboard provides extensive analytics and reporting features:

- **User Growth Tracking**: Monitor cumulative user registrations over time
- **Activity Metrics**: Track user logins, registrations, and overall activity scores
- **Role Distribution**: Visualize user distribution across different roles
- **Status Monitoring**: Track active vs. inactive user ratios
- **Weekly Activity Analysis**: View activity patterns throughout the week
- **Dynamic Notifications**: Get real-time system notifications

## 🔐 Authentication & Security

Security is a top priority with:

- JWT token-based authentication
- HTTP-only cookies for session management
- Password encryption with bcrypt
- Protected routes with middleware
- Role-based access restrictions
- Session timeout and automatic logout

## 🎨 UI Components

Built with a comprehensive set of reusable UI components:

- Modular design system for consistency
- Accessible form controls with validation
- Interactive data visualization components
- Toast notifications for user feedback
- Modal dialogs and popovers
- Responsive navigation system

## 🚀 Technology Stack

- **Frontend**:
  - Next.js 15
  - React 19
  - TypeScript
  - Tailwind CSS
  - Radix UI components
  - Recharts for data visualization
  - SWR for data fetching
  - Framer Motion for animations

- **Backend**:
  - Next.js API Routes
  - MongoDB for data storage
  - JWT for authentication
  - bcrypt for password hashing
  - Zod for schema validation

## ✨ Cool Features

### Interactive Charts with Dynamic Data
The dashboard features interactive charts that update in real-time as data changes. The visualization system automatically calculates metrics like growth rates, activity scores, and user distributions.

### Role-Based UI Adaptation
The UI adapts based on the user's role, showing different navigation options, functionality, and data access permissions depending on whether the user is an Admin, Editor, or regular User.

### Animated Notifications
The system includes an animated notification center that displays important alerts about system updates, new user registrations, and key metrics changes.

### Theme Switching
Seamlessly switch between light and dark themes with a beautiful transition effect. The theme preference is saved in local storage for persistence.

### Credentials Helper
A unique floating helper button provides easy access to test credentials, making demonstration and testing effortless.

### Sparkle Effects & Micro-interactions
The UI includes subtle micro-interactions and visual effects that enhance user experience, such as the sparkle effect on certain actions and smooth transitions between states.

## 📱 Responsive Design

The dashboard is fully responsive and works flawlessly on:
- Desktop computers
- Tablets
- Mobile phones

The layout intelligently adapts to different screen sizes while maintaining functionality and usability.

## 🔧 Installation & Setup

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/user-management.git
   cd user-management
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Set up environment variables
   Create a `.env.local` file with the following:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Run the development server
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📚 Documentation

For detailed component documentation, refer to the inline code comments and TypeScript type definitions.

## 🔒 Test Credentials

For demonstration purposes, you can use the following credentials:

| Role  | Email                   | Password    |
|-------|-------------------------|-------------|
| Admin | sumanjanaled@gmail.com  | Suman@1974 |
| Editor| abc@gmail.com           | Suman@1974 |
| User  | worktodo116@gmail.com   | Suman@1974 |

