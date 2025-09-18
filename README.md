# Loan Management Application

A comprehensive full-stack Next.js application for managing loans, built with modern web technologies including TypeScript, Tailwind CSS, shadcn/ui, Prisma, and PostgreSQL.

## 🚀 Features

### ✨ Core Functionality
- **Loan Management**: Create, view, edit, and manage loan applications
- **Status Tracking**: Track loan status through various stages (Pending, Approved, Active, Paid Off, etc.)
- **Dashboard**: Overview with key metrics and recent loans
- **Search & Filter**: Advanced filtering by status, borrower information, and loan details
- **Payment Calculator**: Real-time payment calculations with interest and term

### 🎯 User Experience
- **Responsive Design**: Mobile-first responsive layout
- **Modern UI**: Clean, professional interface using shadcn/ui components
- **Real-time Feedback**: Toast notifications for user actions
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **Fast Performance**: Optimized with Next.js App Router and Server Actions

### 🛠 Technical Features
- **Type Safety**: Full TypeScript implementation
- **Database**: PostgreSQL with Prisma ORM
- **Server Actions**: Next.js Server Actions for server-side operations
- **Form Validation**: Comprehensive form validation with Zod
- **Code Quality**: ESLint, Prettier, and strict TypeScript configuration

## 📋 Pages & Components

### Pages
- **Dashboard** (`/`): Overview with statistics and recent loans
- **Loans List** (`/loans`): Filterable table of all loans
- **Loan Details** (`/loans/[id]`): Detailed loan information with status actions
- **Create Loan** (`/loans/new`): Form to create new loan applications
- **Edit Loan** (`/loans/[id]/edit`): Form to edit existing loans

### Key Components
- **Navigation**: Responsive navigation with active states
- **LoanForm**: Reusable form for creating/editing loans with validation
- **LoansTable**: Data table with sorting and filtering
- **LoanFilters**: Advanced search and filter controls
- **LoanStatusActions**: Status transition buttons with business logic

## 🏗 Architecture

### Database Schema
```prisma
model Loan {
  id            String   @id @default(cuid())
  borrowerName  String
  borrowerEmail String
  amount        Float
  interestRate  Float
  termMonths    Int
  purpose       String
  status        LoanStatus @default(PENDING)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // Calculated fields
  monthlyPayment   Float?
  totalInterest    Float?
  remainingBalance Float?
  startDate        DateTime?
  endDate          DateTime?
  notes            String?
}

enum LoanStatus {
  PENDING
  APPROVED
  ACTIVE
  PAID_OFF
  DEFAULTED
  REJECTED
}
```

### Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js Server Actions
- **Database**: PostgreSQL, Prisma ORM
- **Validation**: Zod schema validation
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Date Handling**: date-fns

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd loan-management-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your database URL:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/loan_management_db"
   ```

4. **Setup database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run database migrations
   npm run db:migrate
   
   # (Optional) Open Prisma Studio
   npm run db:studio
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open application**
   Navigate to `http://localhost:3000`

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
```

## 🎨 Design System

### Color Scheme
- **Primary**: Blue tones for actions and highlights
- **Status Colors**: 
  - Green for approved/active loans
  - Yellow for pending loans
  - Red for rejected/defaulted loans
  - Gray for completed loans

### Typography
- **Font**: Inter (system font fallback)
- **Hierarchy**: Clear typographic hierarchy with consistent sizing

### Components
- Built with Radix UI primitives for accessibility
- Consistent spacing using Tailwind CSS
- Responsive design patterns
- Focus states and keyboard navigation

## 🧪 Testing

### Manual Testing Checklist
- [ ] Create new loan application
- [ ] Edit existing loan
- [ ] Update loan status
- [ ] Search and filter loans
- [ ] Navigate between pages
- [ ] Responsive design on mobile
- [ ] Form validation errors
- [ ] Toast notifications
- [ ] Accessibility with keyboard navigation

## 🔒 Security Features

- **Input Validation**: Server-side validation with Zod schemas
- **SQL Injection Protection**: Prisma ORM with parameterized queries
- **Type Safety**: TypeScript prevents runtime type errors
- **Error Handling**: Graceful error handling with user feedback

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### Manual Deployment
1. Build the application: `npm run build`
2. Setup PostgreSQL database
3. Run migrations: `npm run db:migrate`
4. Start the application: `npm run start`

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with proper TypeScript typing
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions or support, please open an issue in the GitHub repository.
