# SmartMart Pro - AI-Powered Supermarket Management System

A comprehensive, production-ready supermarket ERP system built with Next.js 15, MongoDB, and AI integration.

## Features

### Core Modules
- **Executive Dashboard** - Real-time KPIs, charts, and business insights
- **Inventory Management** - Complete CRUD, stock tracking, expiry alerts
- **POS System** - Barcode scanning, cart management, multiple payment methods
- **Digital Receipts** - Print, download, and share receipts
- **Sales Analytics** - Daily/weekly/monthly/yearly views with trends
- **Customer CRM** - Customer profiles, purchase history, loyalty points
- **Supplier Management** - Track suppliers, payments, and outstanding debts
- **Expense Tracking** - Categorized expenses with profit calculation
- **Employee Management** - Staff accounts, performance tracking, attendance
- **Notifications System** - Real-time alerts for stock, expiry, and payments

### AI Features
- **AI Business Assistant** - OpenAI-powered insights and recommendations
- **Sales Prediction** - ML-based demand forecasting
- **Smart Analytics** - Automated business intelligence

### Advanced Features
- **Multi-branch Support** - Manage multiple store locations
- **Online Ordering** - Customer-facing e-commerce
- **WhatsApp Integration** - Order processing via WhatsApp
- **Paystack Integration** - Secure payment processing

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Shadcn UI, Framer Motion
- **Backend**: Next.js Server Actions, Node.js
- **Database**: MongoDB, Mongoose ODM
- **Authentication**: NextAuth.js with role-based access control
- **File Storage**: Cloudinary
- **Charts**: Recharts
- **Payments**: Paystack
- **AI**: OpenAI API

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- OpenAI API key (for AI features)
- Cloudinary account (for image uploads)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (create `.env.local`):
```env
MONGODB_URI=mongodb://localhost:27017/smartmart
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
OPENAI_API_KEY=your-openai-api-key
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
PAYSTACK_PUBLIC_KEY=your-paystack-public-key
PAYSTACK_SECRET_KEY=your-paystack-secret-key
```

3. Seed the database with demo data:
```bash
npm run seed
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

### Demo Credentials

After seeding, use these credentials to login:

- **Admin**: admin@smartmart.com / admin123
- **Manager**: manager@smartmart.com / manager123
- **Cashier**: cashier@smartmart.com / cashier123

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── login/             # Authentication pages
├── components/            # Reusable components
├── lib/                   # Utilities and configurations
│   ├── actions/           # Server actions
│   ├── mongodb.ts         # Database connection
│   └── auth.ts            # NextAuth configuration
├── models/                # MongoDB schemas
└── types/                 # TypeScript types
```

## User Roles

### Admin/Owner
- Full access to all features
- Manage employees and branches
- View all analytics and reports
- Configure system settings

### Manager
- Manage products and inventory
- View sales reports
- Manage suppliers and customers
- Track expenses

### Cashier
- Process sales at POS
- Print receipts
- View assigned tasks

## Deployment

### Railway (Recommended)
1. Push code to GitHub
2. Create a new project on [Railway](https://railway.app)
3. Deploy from GitHub repo
4. Add environment variables in Railway dashboard
5. Generate a domain under Settings → Networking

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### MongoDB Atlas
1. Create a free cluster
2. Add connection string to environment variables
3. Enable IP whitelist

### Cloudinary
1. Create account
2. Add environment variables
3. Configure upload presets

## Security Features

- Secure authentication with NextAuth.js
- Password hashing with bcrypt
- Role-based access control
- Protected API routes
- Input validation with Zod

## License

MIT
