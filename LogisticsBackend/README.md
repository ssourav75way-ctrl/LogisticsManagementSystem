# FleetTrack Logistics Backend

A robust .NET 8 Web API for managing logistics, fleet tracking, and real-time operational logging.

## Tech Stack

- **Framework**: .NET 8
- **ORM**: Entity Framework Core
- **Database**: MySQL / MariaDB
- **Real-time**: SignalR Hubs
- **Security**: JWT Authentication & Role-based Access Control
- **Libraries**: MiniExcel (Excel Processing)

## Core Features

- **Fleet Management**: Track vehicles, statuses, and locations.
- **Route Optimization**: Create and manage complex routes with multiple stops.
- **Real-time Monitoring**: Instant updates for stop arrivals and route status changes.
- **Operational Logs**: Comprehensive event logging for all transit activities.
- **Bulk Operations**: Excel-based route creation and batch processing.
- **Data Seeding**: Automatic database initialization with test users and vehicles.

## Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [MySQL](https://www.mysql.com/) or any compatible MariaDB instance.

### Configuration

Update the connection string in `appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "server=localhost;database=fleettrack;user=root;password=yourpassword"
}
```

### Running the Project

1. Navigate to the project directory.
2. Run database migrations (if any) or rely on `EnsureCreated()` in the seeder.
3. Start the application:
   ```bash
   dotnet run
   ```

## API Documentation (Swagger)

Once running, the API documentation is available at:
`http://localhost:5164/swagger/index.html`

## Seed Data

On first run, the system automatically seeds:

- **Admin**: `admin@fleettrack.com` / `password123`
- **Driver**: `john@driver.com` / `password123`
- **Dispatcher/Admin**: `sarah@dispatcher.com` / `password123`
