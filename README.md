# React Task Buddy

A feature-rich task management application built with React, TypeScript, and Tailwind CSS.

## Features

- Create, edit, and delete tasks
- Task filtering by status, priority, category, and tags
- Search functionality
- Due date tracking with overdue indicators
- Dark mode support
- Local storage persistence
- Responsive design
- User login system

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for accessible UI components
- **React Router** for client-side routing
- **React Query** for server state management
- **date-fns** for date formatting

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/avishkar-004/react-task-buddy.git

# Navigate to the project directory
cd react-task-buddy

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:8080`.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
  components/     # React components
    ui/           # shadcn/ui base components
  contexts/       # React context providers
  hooks/          # Custom React hooks
  lib/            # Utility libraries
  pages/          # Page components
  types/          # TypeScript type definitions
  utils/          # Utility functions
```

## Contributors

- **Aryasadalage** - UI components, features, and polish
- **Avishkar Pawar** - Architecture, state management, and infrastructure
