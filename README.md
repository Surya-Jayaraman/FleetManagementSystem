# Fleet Management System

A comprehensive fleet management solution built with modern web technologies and C# backend services.

## Overview

The Fleet Management System is designed to streamline vehicle fleet operations, including tracking, maintenance scheduling, route optimization, and driver management. This project combines a robust C# backend with a responsive web frontend.

## Tech Stack

- **Backend**: C# (55.9%)
- **Frontend**: 
  - TypeScript (16.7%)
  - HTML (17.8%)
  - CSS (9.6%)

## Features

- 🚗 **Vehicle Management** - Track and manage your entire fleet
- 👥 **Driver Management** - Maintain driver profiles and records
- 📍 **GPS Tracking** - Real-time vehicle location tracking
- 🔧 **Maintenance Scheduling** - Automated maintenance reminders and tracking
- 📊 **Reporting & Analytics** - Comprehensive fleet analytics and reports
- 📱 **Responsive Design** - Access from desktop or mobile devices
- 🔐 **Secure Authentication** - Enterprise-grade security

## Getting Started

### Prerequisites

- .NET Framework or .NET Core (for C# backend)
- Node.js and npm (for TypeScript/frontend)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Surya-Jayaraman/FleetManagementSystem.git
   cd FleetManagementSystem
   ```

2. **Backend Setup**
   ```bash
   cd backend
   dotnet restore
   dotnet build
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

### Running the Application

**Backend**
```bash
cd backend
dotnet run
```

**Frontend**
```bash
cd frontend
npm start
```

The application should now be accessible at `http://localhost:3000` (or your configured port).

## Project Structure

```
FleetManagementSystem/
├── backend/              # C# backend services
│   ├── Controllers/      # API endpoints
│   ├── Models/          # Data models
│   ├── Services/        # Business logic
│   └── Data/            # Database context
├── frontend/            # TypeScript/HTML/CSS frontend
│   ├── src/
│   ├── public/
│   └── styles/
├── docs/               # Documentation
└── README.md           # This file
```

## Configuration

Configuration files are typically located in:
- Backend: `appsettings.json`
- Frontend: Environment variables or `.env` file

Ensure you update these with your environment-specific settings.

## API Documentation

The backend API endpoints are documented in the [API Documentation](./docs/API.md) file.

### Example API Endpoints

- `GET /api/vehicles` - List all vehicles
- `POST /api/vehicles` - Add a new vehicle
- `GET /api/drivers` - List all drivers
- `GET /api/maintenance` - View maintenance records

## Development

### Code Style

- **C#**: Follow Microsoft C# Coding Conventions
- **TypeScript**: Use ESLint and Prettier for code formatting
- **CSS**: Follow BEM (Block Element Modifier) methodology

### Running Tests

```bash
# Backend tests
cd backend
dotnet test

# Frontend tests
cd frontend
npm test
```

## Database

The system uses a relational database. Database migrations are managed through:

```bash
# Backend (Entity Framework)
dotnet ef database update
```

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues, questions, or suggestions, please open an issue on the [GitHub Issues](https://github.com/Surya-Jayaraman/FleetManagementSystem/issues) page.

## Author

**Surya Jayaraman**
- GitHub: [@Surya-Jayaraman](https://github.com/Surya-Jayaraman)

## Acknowledgments

- Built with modern development practices
- Inspired by industry-leading fleet management solutions
- Thanks to all contributors and supporters

---

**Last Updated**: May 2026

For more information and documentation, please visit the [project wiki](https://github.com/Surya-Jayaraman/FleetManagementSystem/wiki).
