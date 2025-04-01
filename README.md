# Real Estate CRM

A modern web application for managing real estate properties, clients, documents, and expenses.

## Features

- **Property Management**: Track property listings, details, and status
- **Client Management**: Manage client information and interactions
- **Document Management**: Store and organize important documents
- **Expense Tracking**: Monitor and categorize expenses
- **User Authentication**: Secure login and registration system
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- Next.js 15
- TypeScript
- Prisma
- PostgreSQL
- Tailwind CSS
- Shadcn UI Components

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/Timothee450/real-estate-crm.git
   cd real-estate-crm
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="your-database-url"
   JWT_SECRET="your-jwt-secret"
   ```

4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploying to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and sign in with your GitHub account
3. Click "New Project"
4. Import your repository
5. Configure your project:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
6. Add your environment variables:
   - `DATABASE_URL`: Your production database URL
   - `JWT_SECRET`: Your JWT secret key
7. Click "Deploy"

### Database Setup

For production, you'll need a PostgreSQL database. You can use:
- [Supabase](https://supabase.com) (Recommended)
- [Railway](https://railway.app)
- [Neon](https://neon.tech)
- Any other PostgreSQL provider

After setting up your database:
1. Get your database connection URL
2. Add it to your Vercel environment variables as `DATABASE_URL`
3. Run the database migrations:
   ```bash
   npx prisma db push
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
