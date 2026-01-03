# Truck Fleet Pro

**Truck Fleet Pro** is a comprehensive fleet management solution designed to streamline operations for logistics and transportation businesses. This modern dashboard provides real-time visibility into your fleet, drivers, trips, fuel consumption, and maintenance schedules.

## 🚀 Key Features

*   **📊 Interactive Dashboard**
    *   Get a high-level overview of total fleet status, active trips, and recent alerts.
    *   Monitor key performance indicators (KPIs) like total distance, fuel costs, and fleet availability.

*   **🚛 Truck Management**
    *   Detailed registry of all vehicles in the fleet.
    *   Track status (Active, Maintenance, In Transit, Idle).
    *   Monitor usage stats and vehicle specifications.

*   **bust_in_silhouette Driver Management**
    *   Manage driver profiles, licenses, and certifications.
    *   Track driver assignments and performance history.
    *   Monitor license expiration dates.

*   **📍 Trip Management**
    *   Log and track trips with start/end locations and dates.
    *   Monitor trip status (Scheduled, En Route, Completed).
    *   Assign drivers and trucks to specific routes.

*   **⛽ Fuel Logic & Tracking**
    *   Record fuel fills and associated costs.
    *   Analyze fuel efficiency (MPG/L per 100km).
    *   Track fuel expenses by vehicle or time period.

*   **🔧 Maintenance System**
    *   Schedule preventive maintenance and repairs.
    *   Track maintenance history and costs.
    *   Receive alerts for upcoming service needs.

*   **📈 Reports & Analytics**
    *   Visual data representation using interactive charts (Recharts).
    *   Analyze costs, fleet utilization, and operational efficiency over time.

## 🛠️ Technology Stack

This project is built using a modern, robust frontend stack ensuring performance and maintainability:

*   **Framework**: [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool**: [Vite](https://vitejs.dev/) for fast development and bundling.
*   **Styling**: 
    *   [Tailwind CSS](https://tailwindcss.com/) for utility-first styling.
    *   [shadcn/ui](https://ui.shadcn.com/) for beautiful, accessible UI components.
    *   [Lucide React](https://lucide.dev/) for consistent iconography.
*   **State Management & Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest) for efficient server state management.
*   **Routing**: [React Router](https://reactrouter.com/) for client-side navigation.
*   **Charts**: [Recharts](https://recharts.org/) for data visualization.
*   **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for schema validation.

## 🏁 Getting Started

Follow these steps to set up the project locally:

### Prerequisites

Ensure you have Node.js (v18 or higher) installed on your machine.

### Installation

1.  **Clone the repository**
    ```sh
    git clone <YOUR_GIT_URL>
    cd truck-fleet-pro
    ```

2.  **Install dependencies**
    ```sh
    npm install
    # or
    yarn install
    # or
    bun install
    ```

3.  **Start the development server**
    ```sh
    npm run dev
    ```

    The application will actiavte at `http://localhost:8080` (or similar).

### Building for Production

To create a production-ready build:

```sh
npm run build
```

## 📂 Project Structure

```
src/
├── components/     # Reusable UI components & layout elements
├── data/          # Mock data and static content
├── hooks/         # Custom React hooks
├── lib/           # Utility functions (shadcn utils, etc.)
├── pages/         # Page components (routed views)
├── types/         # TypeScript definitions
└── App.tsx        # Main application entry & routing
```

## 📄 License

This project is private and proprietary.
