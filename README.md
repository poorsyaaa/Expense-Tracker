# Expense Tracker

![Expense Tracker Banner](https://placeholder-for-your-banner-image.jpg)

A comprehensive, modern expense tracking application built with Next.js and TypeScript. This app helps you manage personal finances, track expenses, and generate detailed reports.

**Version:** 1.2.0

[Video Demo](#) <!-- Add your video link here later -->

## 🌟 Features

- **Dashboard**: Get a visual overview of your spending habits with interactive charts and summaries
- **Expense Management**: Easily add, edit, and categorize expenses with filtering capabilities
- **Reports**: Generate detailed reports with flexible date range filtering and export options (PDF & CSV)
- **Category Management**: Organize expenses with custom categories and drag-and-drop category groups
- **Budget Planning**: Set monthly budgets and track your spending against your goals
- **Light/Dark Mode**: Built-in theme support for comfortable viewing in any environment
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 📸 Screenshots

![Dashboard](https://placeholder-for-dashboard-screenshot.jpg)
![Expenses Page](https://placeholder-for-expenses-screenshot.jpg)
![Reports Page](https://placeholder-for-reports-screenshot.jpg)

## 🚀 Getting Started

### Prerequisites

- Node.js 20.17.0 or higher
- npm 7.0.0 or higher
- PostgreSQL database

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/expense-tracker.git
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

## 📊 Changelog

### Version 1.2.0 (Latest)

- Added comprehensive reports page with PDF/CSV export
- Enhanced date range picker for more flexible filtering options

### Version 1.1.1-beta

- Rebuilt expenses page with improved filtering capabilities
- Added monthly navigation with visual expense tracking

### Version 1.1.0-beta

- Introduced category groups with drag-and-drop functionality
- Added emoji picker for category icons

[View full changelog](http://localhost:3000/docs/change-log)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Contact

Your Name - [@your_twitter](https://twitter.com/your_twitter) - email@example.com

Project Link: [https://github.com/your-username/expense-tracker](https://github.com/your-username/expense-tracker)

---

Made with ❤️ using Next.js
