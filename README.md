# Expense Tracker

![Expense Tracker Banner](https://github.com/poorsyaaa/Expense-Tracker/blob/main/screenshot/dashboard.png)

A comprehensive, modern expense tracking application built with Next.js and TypeScript. This app helps you manage personal finances, track expenses, and generate detailed reports.

**Version:** 1.2.0

[Video Demo](https://1drv.ms/v/c/98150728dfebfa2e/EfCUSEA8pUpJguZNJ1J3qD0BhNlcHLPsC0wImVSHLV-zCA?e=1tEN0N) <!-- Add your video link here later -->

## 🌟 Features

- **Dashboard**: Get a visual overview of your spending habits with interactive charts and summaries
- **Expense Management**: Easily add, edit, and categorize expenses with filtering capabilities
- **Reports**: Generate detailed reports with flexible date range filtering and export options (PDF & CSV)
- **Category Management**: Organize expenses with custom categories and drag-and-drop category groups
- **Budget Planning**: Set monthly budgets and track your spending against your goals
- **Light/Dark Mode**: Built-in theme support for comfortable viewing in any environment
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 📸 Screenshots

![Dashboard](https://github.com/poorsyaaa/Expense-Tracker/blob/main/screenshot/dashboard.png)
![Expenses Page](https://github.com/poorsyaaa/Expense-Tracker/blob/main/screenshot/expense.png)
![Reports Page](https://github.com/poorsyaaa/Expense-Tracker/blob/main/screenshot/reports.png)
![Settings](https://github.com/poorsyaaa/Expense-Tracker/blob/main/screenshot/settings.png)
![Documentation](https://github.com/poorsyaaa/Expense-Tracker/blob/main/screenshot/docs.png)
![Profile](https://github.com/poorsyaaa/Expense-Tracker/blob/main/screenshot/profile.png)

## 🚀 Getting Started

### Prerequisites

- Node.js 20.17.0 or higher
- npm 7.0.0 or higher
- PostgreSQL database

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/poorsyaaa/Expense-Tracker.git
cd expense-tracker
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory and add the following variables:

```
DATABASE_URL="postgresql://username:password@localhost:5432/expense_tracker"
AUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Initialize the database**

```bash
npx prisma generate
npx prisma db push
```

5. **Run the development server**

```bash
npm run dev
```

6. **Optional: Seed the database with sample data**

```bash
npm run seed
```

Visit [http://localhost:3000](http://localhost:3000) to use the application.

## 🛠️ Built With

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Language
- [Prisma](https://www.prisma.io/) - ORM
- [PostgreSQL](https://www.postgresql.org/) - Database
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [date-fns](https://date-fns.org/) - Date manipulation
- [jsPDF](https://github.com/parallax/jsPDF) - PDF generation
- [Recharts](https://recharts.org/) - Charts and visualizations
- [React Hook Form](https://react-hook-form.com/) - Form handling
- [Zod](https://github.com/colinhacks/zod) - Schema validation

## 🐳 Docker Support

The application includes Docker support for easy deployment.

```bash
# Build and start the containers
npm run docker:up

# Stop the containers
npm run docker:down
```

## 📄 Documentation

Comprehensive documentation is available within the application. Navigate to the "Docs" section in the app or visit [/docs](http://localhost:3000/docs) when running locally.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Made with ❤️ using Next.js
