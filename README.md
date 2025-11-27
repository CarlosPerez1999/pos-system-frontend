# POS System Frontend

Modern Point of Sale (POS) system frontend built with Angular 19, featuring a complete password management system, configuration management, and comprehensive admin panel.

## 📋 Features

### 🔐 Authentication & Security

- **Secure Login** - JWT-based authentication with role-based access
- **Forgot Password** - Email-based password reset flow (15-minute token expiration)
- **Change Password** - Authenticated users can update their password with old password verification
- **Reset Password** - Secure token-based password reset page
- **Protected Routes** - Auth guards for admin and POS sections
- **Auto Redirect** - Role-based redirection (admin/cashier)

### 👨‍� Admin Panel

- **Dashboard** - Sales analytics, KPIs, and charts visualization
- **Products Management** - Full CRUD operations with image support
- **Inventory Management** - Stock tracking and updates
- **Users Management** - Create, edit, and manage system users
- **Store Configuration** - Manage store name and logo settings
- **Search & Pagination** - Efficient data handling with infinite scroll

### 🛒 POS Interface

- **Fast Checkout** - Intuitive product selection interface
- **Cart Management** - Add, remove, update quantities
- **Real-time Calculations** - Automatic totals and tax calculations
- **Product Search** - Search by name, SKU, or barcode
- **Receipt Generation** - Print-ready sales receipts

### 🎨 UI/UX

- **Modern Design** - Glassmorphism effects and gradient accents
- **Dark/Light Mode** - Theme toggle with persistent preference
- **Responsive Layout** - Mobile-first design approach
- **Loading States** - Visual feedback for all async operations
- **Toast Notifications** - User-friendly success/error messages
- **Form Validation** - Real-time validation with helpful error messages

## 🚀 Tech Stack

- **Framework**: Angular 19 (Standalone Components)
- **State Management**: Angular Signals & Computed
- **HTTP**: HttpClient with resource API
- **Forms**: Reactive Forms with custom validators
- **Styling**: Tailwind CSS v3
- **Icons**: Iconify (multiple icon sets)
- **Charts**: Chart.js with ng2-charts
- **Build Tool**: Angular CLI with esbuild

## 📦 Prerequisites

- Node.js >= 18.x
- npm or pnpm
- Angular CLI (`npm install -g @angular/cli`)

## ⚙️ Installation

```bash
# Clone the repository
git clone https://github.com/CarlosPerez1999/pos-system-frontend
cd pos-system-frontend

# Install dependencies
npm install

# Run development server
ng serve

# Navigate to http://localhost:4200
```

## 🔧 Configuration

### Environment Setup

Update API URLs in environment files:

**Development** (`src/environments/environment.development.ts`):

```typescript
export const environment = {
  production: false,
  API_URL: "http://localhost:3000/api",
};
```

**Production** (`src/environments/environment.ts`):

```typescript
export const environment = {
  production: true,
  API_URL: "https://your-production-api.com/api",
};
```

## 🏗️ Project Structure

```
src/
├── app/
│   ├── auth/                     # Authentication module
│   │   ├── login/               # Login component
│   │   ├── reset-password/      # Password reset page
│   │   └── auth-service.ts      # Auth service with JWT handling
│   ├── core/                    # Core services and guards
│   │   ├── guards/              # Route guards (auth, role)
│   │   ├── models/              # TypeScript interfaces
│   │   ├── interceptors/        # HTTP interceptors
│   │   └── services/            # Global services (theme, toast, modal)
│   ├── features/                # Feature modules
│   │   ├── admin/               # Admin panel
│   │   │   ├── pages/           # Admin pages (dashboard, products, etc.)
│   │   │   ├── layouts/         # Admin layout wrapper
│   │   │   └── services/        # Admin-specific services
│   │   ├── pos/                 # POS interface
│   │   ├── products/            # Products feature
│   │   ├── inventory/           # Inventory feature
│   │   ├── users/               # Users feature
│   │   └── sales/               # Sales feature
│   ├── shared/                  # Shared components and utilities
│   │   ├── components/          # Reusable UI components
│   │   └── validators/          # Custom form validators
│   └── app.routes.ts            # Route configuration
└── environments/                # Environment configs
```

## 🔑 Password Management System

### Workflow Overview

#### 1. Forgot Password

```
Login Page → Forgot Password Link → Email Input Modal →
API sends reset link → User clicks email link → Reset Password Page
```

#### 2. Change Password (Authenticated)

```
Admin Header → Lock Icon → Change Password Modal →
Old Password + New Password → Verify & Update
```

#### 3. Reset Password

```
Email Link (/auth/reset-password?token=xyz) → Extract Token →
New Password Form → Validate Token → Update Password → Redirect to Login
```

### API Endpoints

```typescript
// Authentication
POST / api / auth / login; // Login with username/password
POST / api / auth / me; // Validate JWT token
POST / api / auth / forgot - password; // Request password reset
POST / api / auth / change - password; // Change password (requires JWT)
POST / api / auth / reset - password; // Reset password with token

// Configuration
GET / api / configuration; // Get store configuration
PATCH / api / configuration; // Update configuration (requires JWT)

// Other endpoints documented in backend API
```

## 🧪 Development

### Running Tests

```bash
# Unit tests
ng test

# E2E tests
ng e2e

# Test coverage
ng test --code-coverage
```

### Building for Production

```bash
# Production build
ng build --configuration production

# Output: dist/pos_system_ui/browser/
```

### Code Quality

```bash
# Linting
ng lint

# Format code
npm run format
```

## 🚀 Production Deployment

### Build Steps

1. Update `src/environments/environment.ts` with production API URL
2. Run `ng build --configuration production`
3. Deploy `dist/pos_system_ui/browser/` folder to your hosting service

### Hosting Options

#### Static Hosting (Vercel, Netlify, Firebase)

```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod --dir=dist/pos_system_ui/browser

# Firebase
firebase deploy
```

#### Traditional Server (Nginx)

```nginx
server {
  listen 80;
  server_name yourdomain.com;

  root /var/www/pos-frontend/dist/pos_system_ui/browser;
  index index.html;

  # Angular routing
  location / {
    try_files $uri $uri/ /index.html;
  }

  # Caching
  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

### Production Checklist

#### Security

- [ ] Update production API URL in environment file
- [ ] Enable HTTPS for all communications
- [ ] Configure CORS properly on backend
- [ ] Set secure JWT expiration times
- [ ] Implement rate limiting on backend
- [ ] Remove console.log statements
- [ ] Enable Content Security Policy headers

#### Performance

- [ ] Enable production mode
- [ ] Configure lazy loading for all feature modules
- [ ] Optimize images and assets
- [ ] Enable gzip/brotli compression
- [ ] Configure browser caching
- [ ] Minify and bundle code
- [ ] Remove source maps (or serve separately)

#### Monitoring

- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure analytics (Google Analytics, etc.)
- [ ] Set up application monitoring
- [ ] Configure logging

## 🎯 Key Components

### Custom Validators

- **`passwordMatchValidator`** - Ensures password confirmation matches

### Shared Components

- **`AppButton`** - Reusable button with variants
- **`AppInputForm`** - Form input with validation display
- **`AppModal`** - Modal dialog component
- **`AppTable`** - Data table with pagination
- **`AppHeader`** - Application header with theme toggle
- **`ChangePasswordModal`** - Password change modal

### Services

- **`AuthService`** - JWT authentication and password management
- **`ThemeService`** - Dark/light theme management
- **`ToastService`** - Toast notification system
- **`ModalService`** - Modal dialog management
- **`ConfigurationService`** - Store configuration management

## 📱 Responsive Design

The application is fully responsive and optimized for:

- 📱 Mobile devices (320px+)
- 📲 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1920px+)

## 🌐 Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## � Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Carlos Alfredo Pérez Hernández**  
Computer Systems Engineer

## 🐛 Troubleshooting

### Common Issues

**API Connection Errors**

- Verify `API_URL` in environment file
- Check backend server is running
- Verify CORS configuration on backend

**Build Errors**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
ng cache clean
```

**Authentication Issues**

- Check JWT token in browser localStorage
- Verify token hasn't expired
- Check auth guard configuration

**Theme Not Persisting**

- Verify localStorage is enabled in browser
- Check browser console for errors

## 📚 Additional Resources

- [Angular Documentation](https://angular.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Chart.js](https://www.chartjs.org/docs/)
- [Iconify](https://iconify.design/)

## 🔄 Version History

### v1.0.0 (Current)

- ✅ Complete authentication system
- ✅ Password management (forgot, change, reset)
- ✅ Admin panel with dashboard
- ✅ POS interface
- ✅ Products, inventory, and users management
- ✅ Store configuration
- ✅ Dark/light theme
- ✅ Responsive design
