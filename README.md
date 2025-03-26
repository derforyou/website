# React Router & Cloudflare Pages Template 🚀

Modern web application template built with React Router and Cloudflare Pages integration 🌐.  
Built this because I wanted a template that would allow me to deploy my React Router app on Cloudflare Pages quickly and easily! 🚀 There was no public template available at the time, so I decided to make one. And here it is! 🎉

## 🚀 Features

- ⚡ Vite for lightning-fast development
- 🎯 React Router for seamless navigation
- ☁️ Cloudflare Pages integration
- 🌐 Cloudflare D1 integration
- 🎨 TailwindCSS for styling
- 📦 TypeScript support
- 🔄 Hot Module Replacement (HMR)
- 🗄️ Drizzle & Kysely for database management
- 🎬 Framer Motion for animations

## 🗄️ About Cloudflare D1

Cloudflare D1 is a serverless SQL database that runs on Cloudflare's global network. Key features include:

- 📊 SQLite-compatible database built on libSQL
- 🌐 Distributed across Cloudflare's global network
- ⚡ Zero configuration required
- 🔒 Automatic backups and high availability
- 💰 Free tier with generous limits
- 🚀 Low latency, as data is stored close to your users
- 🔄 Seamless integration with Cloudflare Workers

D1 is perfect for:
- Web applications requiring global data access
- Projects needing SQL without managing infrastructure
- Applications with moderate data requirements (up to 100GB per database)

## 📦 Installation

```bash
git clone https://github.com/Xazu001/react-router-cf.git
cd react-router-cf
npm install
```

## ⚙️ Configuration

1. Create a D1 Database in Cloudflare:
   - Go to Cloudflare Dashboard > Workers & Pages
   - Click on "D1" in the sidebar
   - Click "Create database"
   - Note down the `database_name` and `database_id`

2. Configure `wrangler.toml`:
   ```toml
   name = "your-project-name"
   
   [vars]
   JWT_PRIVATE = """
   Your private key for JWT
   """
   JWT_PUBLIC = """
   Your public key for JWT
   """

   [[d1_databases]]
   binding = "db"
   database_name = "your_database_name"
   database_id = "your_database_id"
   ```

3. Generate JWT Keys:
   ```bash
   # Using OpenSSL to generate keys
   # Generate private key
   openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048
   
   # Generate public key from private key
   openssl rsa -pubout -in private_key.pem -out public_key.pem
   ```
   Copy the contents of these files into the respective JWT_PRIVATE and JWT_PUBLIC fields in `wrangler.toml`

4. Environment Variables: 🔐
```bash
# Create a .env file in the root directory
touch .env

# Add the following environment variables
CLOUDFLARE_ACCOUNT_ID="your_account_id"
CLOUDFLARE_DATABASE_ID="your_database_id"
CLOUDFLARE_D1_TOKEN="your_d1_token"
```

5. Development: 🛠️
```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Your app will be available at http://localhost:5173
```

## 🏗️ Building for Production

Build your application:
```bash
npm run build
```

The optimized build will be available in the `dist` directory.

## 🚀 Deployment

Deploy to Cloudflare Pages:
```bash
npm run deploy
```

> **Note**: Make sure you have configured your Cloudflare account and set up the necessary environment variables.

## 📁 Project Structure
```
react-router-cf/
├── app/
│   ├── components/    # Reusable components
│   ├── routes/        # Application routes
│   └── root.tsx      # Root component
├── public/           # Static assets
├── server/           # Server-side code
│   ├── load-context.ts # Load context for type safety
│   └── ...server files
└── ...config files
```

## 🔧 Tech Stack

- [React](https://reactjs.org/)
- [React Router](https://reactrouter.com/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Cloudflare Pages](https://pages.cloudflare.com/)
- [Cloudflare D1](https://www.cloudflare.com/products/d1/)
- [Drizzle](https://orm.drizzle.team/)
- [Kysely](https://kysely.dev/)
- [Framer Motion](https://www.framer.com/motion/)

## 🔍 Important Development Notes

### Load Context File
The `load-context.ts` file in the server directory is crucial for context availability and type safety in your application. It defines the context and types for your loader and action that will be available throughout your routes. After making any changes to this file, you must run:

```bash
# Generate new types and run type checking
npm run typecheck
```

This command ensures your route types are properly updated and type-safe. Skipping this step after modifying the context may lead to type errors in your routes.

## 📝 License

MIT License - feel free to use this template for your projects!
