# FleetTrack Logistics Frontend

A modern, responsive Angular-based fleet management and route execution platform designed for dispatchers and drivers.

## Tech Stack

- **Framework**: Angular 21 (Latest)
- **Styling**: Vanilla CSS with SCSS (Modular)
- **UI Library**: Angular Material
- **Communication**: HttpClient with JWT Interceptors
- **Icons**: Material Symbols

## Features

### Admin & Dispatcher View

- **Real-time Dashboard**: Overview of active routes, fleet status, and critical alerts.
- **Route Management**: Create, edit, and delete routes with a dedicated stop-ordering system.
- **Vehicle Monitoring**: Track vehicle availability, current locations, and maintenance status.
- **Bulk Upload**: Quick route creation via Excel file imports.
- **Operational Logs**: Audit trail of all driver activities and transit events.

### Driver Execution View

- **Interactive Route Map**: Step-by-step stop list with ETA tracking.
- **Two-Stage Delivery**: Confirm arrival at a location, then explicitly mark items as "Delivered".
- **Journey Controls**: One-click "Complete Journey" functionality with proactive validation.
- **Incident Reporting**: Dedicated "Issue During Transit" button for quick dispatcher notification.

## Getting Started

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   ng serve
   ```
3. Open `http://localhost:4200` in your browser.

## Design System

- **Compact UI**: Optimized for information density without clutter.
- **Dynamic Feedback**: Pulsing buttons and color-coded status badges for intuitive workflow guidance.
- **Responsive Layout**: Seamless transition between desktop dispatcher views and mobile-friendly driver interfaces.

## Configuration

Base API URL is configured in core services (default: `http://localhost:5164/api`).
