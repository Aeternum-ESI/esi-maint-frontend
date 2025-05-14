# ESI-Maint Frontend

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Next.js](https://img.shields.io/badge/Next.js-15%2B-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue)

A comprehensive maintenance management platform designed specifically for the École Supérieure d'Informatique (ESI), enabling efficient tracking, assignment, and resolution of equipment maintenance tasks across the institution.

![ESI-Maint Dashboard Preview](https://github.com/aeternum-esi/esi-maint-frontend/assets/screenshot.png)

## Project Overview

ESI-Maint addresses the challenge of managing maintenance operations for the ESI's equipment inventory. The platform provides role-based access to administrators, technicians, and staff members, enabling efficient reporting and resolution of technical issues, along with comprehensive asset management.

The system enhances operational efficiency by streamlining the maintenance workflow:
- Staff can easily report technical issues
- Administrators can assign tasks to appropriate technicians
- Technicians can manage their assignments and report completions
- All users benefit from real-time status updates and comprehensive reporting

### Key Features

- **Asset Management**: Complete inventory system for all equipment and locations
- **Incident Reporting**: User-friendly interface for reporting technical issues
- **Work Order Management**: Assignment and tracking of maintenance tasks
- **Maintenance Scheduling**: Planning of preventive and corrective interventions
- **Real-time Dashboard**: Comprehensive statistics and KPI visualization
- **Role-based Access Control**: Specific interfaces for staff, technicians, and administrators

## Tech Stack and Dependencies

### Core Technologies
- **Framework**: [Next.js 15+](https://nextjs.org/) with App Router and React Server Components
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [Shadcn UI](https://ui.shadcn.com/)

### State Management & Data Fetching
- React Hooks and Context API
- Next.js Server Actions for data mutations
- Server Components for efficient data fetching

### UI Components
- Shadcn UI - Accessible and customizable component system
- Lucide React - Consistent icon library
- React Hook Form - Form handling with validation

### Media & Document Handling
- [next-cloudinary](https://next.cloudinary.dev/) - Image upload and optimization
- jsPDF with jsPDF-autotable - PDF report generation

### Authentication & Security
- JWT with HTTP-only cookies
- Server-side auth validation
- Role-based access control

### Development Tools
- ESLint - Code quality and consistency
- Prettier - Code formatting
- TypeScript - Static type checking

## Installation Instructions

### Prerequisites
- Node.js 18.17.0 or higher
- pnpm (recommended) or npm
- Backend API running (see [ESI-Maint Backend](https://github.com/aeternum-esi/esi-maint-backend))

### Step-by-Step Setup

1. **Clone the repository**

```bash
git clone https://github.com/aeternum-esi/esi-maint-frontend.git
cd esi-maint-frontend
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Configure environment variables**

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000/api  # Replace with your backend URL
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset_name
```

4. **Start the development server**

```bash
pnpm dev
```

5. **Access the application**

Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

> **Note**: You must also set up and run the backend server from [esi-maint-backend](https://github.com/aeternum-esi/esi-maint-backend) for the application to function properly.

## Project Structure

```
esi-maint-frontend/
├── public/               # Static files (images, etc.)
├── src/                  # Source code
│   ├── app/              # Next.js App Router structure
│   │   ├── actions/      # Server actions for data mutations
│   │   ├── api/          # API route handlers
│   │   ├── dashboard/    # Admin dashboard pages
│   │   ├── signaler/     # Problem reporting interface
│   │   ├── technician/   # Technician dashboard pages
│   │   ├── login/        # Authentication pages
│   │   ├── fetch.ts      # Utility for API requests
│   │   └── page.tsx      # Homepage
│   ├── components/       # Reusable UI components
│   │   ├── ui/           # Shadcn UI components
│   │   └── [feature]/    # Feature-specific components
│   ├── lib/              # Shared utilities and types
│   │   ├── types.ts      # TypeScript interfaces
│   │   └── utils.ts      # Helper functions
│   └── styles/           # Global styles
└── .env.local            # Environment variables (not in repo)
```

### Key Directories Explained

- **`app/`**: Contains all pages and API routes using the Next.js App Router structure.
- **`app/actions/`**: Server-side functions for data fetching and mutations.
- **`app/dashboard/`**: Administration interface with reports, assets, and user management.
- **`app/technician/`**: Interface for technicians to manage assigned tasks.
- **`app/signaler/`**: Public-facing problem reporting interface.
- **`components/ui/`**: Reusable UI components built with Shadcn UI.
- **`lib/types.ts`**: TypeScript interfaces shared across the application.

## Configuration and Environment Variables

### Required Environment Variables

Create a `.env.local` file with the following variables:

```
# API Configuration
NEXT_PUBLIC_BACKEND_URL=your_backend_url  # URL to your backend API

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name  # From Cloudinary dashboard
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset_name  # Create an unsigned upload preset
```

### Cloudinary Setup

This project uses Cloudinary for image uploads. To configure it:

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Create an upload preset:
   - Navigate to Settings > Upload in your Cloudinary dashboard
   - Create a new upload preset with "Signing Mode" set to "Unsigned"
   - Copy the preset name to your `.env.local` file
3. See `README-CLOUDINARY.md` for more detailed configuration options

## Usage and Examples

### User Roles and Features

#### Staff
- Report technical issues through the problem reporting interface
- Track the status of reported issues
- Access is limited to reporting functionality

#### Technicians
- View assigned maintenance tasks
- Update task status and provide resolution details
- Browse asset information for reference
- Access dedicated technician dashboard

#### Administrators
- Full access to all system features
- Manage assets, categories, and locations
- Assign tasks to technicians
- View comprehensive statistics and reports
- Configure user roles and permissions

### Common Tasks

#### Reporting a Technical Issue
1. Navigate to the homepage
2. Click "Report a Problem" button
3. Select the affected asset or location
4. Provide a description of the issue
5. Upload an image if relevant
6. Submit the report

#### Assigning a Task (Administrators)
1. Log in as an administrator
2. Navigate to Dashboard > Reports
3. Select an unassigned report
4. Click "Assign Technician"
5. Select appropriate technician(s)
6. Set deadline and priority
7. Submit assignment

#### Completing a Task (Technicians)
1. Log in as a technician
2. Navigate to "Assigned Requests"
3. Select the task to complete
4. Add resolution details and any notes
5. Click "Mark Complete"

## Contributing Guidelines

We welcome contributions to the ESI-Maint frontend! To contribute:

1. Fork the repository
2. Create a new branch for your feature or bugfix: `git checkout -b feature/your-feature-name`
3. Make your changes, following the coding style and practices
4. Add appropriate tests for your changes
5. Commit your changes with descriptive commit messages
6. Push to your fork and submit a pull request

### Coding Standards

- Follow the established TypeScript and React patterns in the codebase
- Use Prettier for code formatting
- Ensure all components are properly typed
- Use server components where appropriate for data fetching
- Follow the component structure patterns



### Building for Production

```bash
pnpm build       # Create production build
pnpm start       # Start production server
```

### Considerations

- Ensure your backend API is correctly configured and accessible from the deployment environment
- Set up appropriate CORS settings on your backend
- Configure any necessary security headers and CSP

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

For any questions or support, please open an issue on the GitHub repository.