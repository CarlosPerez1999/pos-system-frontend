# PΩS System Frontend (Angular)

A modular frontend for a Point of Sale system built with Angular. Designed to support both the sales terminal and the admin dashboard, with a focus on accessibility, reactive validation, and clean architecture.

## 🚧 Project Status

In progress — initial features implemented:

- ✅ Sales terminal with product selection and cart operations
- ✅ Modal confirmation flow with computed validation
- ⬜ Search bar by SKU, name, or barcode
- ⬜ Toast service for contextual feedback
- ⬜ Admin dashboard

## 🚀 Technologies

- Angular
- RxJS
- Signals & Computed
- TailwindCSS
- TypeScript

## 📦 Requirements

- Node.js >= 18
- pnpm or npm
- Angular CLI

## ⚙️ Installation

```bash
# Clone the repository
git clone https://github.com/CarlosPerez1999/pos-system-frontend

cd pos-system-frontend

# Install dependencies
pnpm install

# Run the app
pnpm start
```

## 📁 Project Structure

```
src/
├── app/
│   ├── core/
│   ├── features/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── pos/
│   │   ├── products/
│   │   └── sales/
│   └── shared/
├── environments/
└── (config files)
```

## 🧠 Author

Carlos Alfredo Pérez Hernández — Computer Systems Engineer