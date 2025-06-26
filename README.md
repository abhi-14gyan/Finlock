# 💰 Finlock — Your Personal Financial Companion
🌐 **Website:** [https://finlock-green.vercel.app](https://finlock-green.vercel.app) 

**Finlock** is a full-stack MERN web application that helps users take control of their finances through personalized budgeting, intelligent tracking, and AI-powered insights — all within a clean, responsive interface.



---

## 🚀 Features

- ✅ **Budget & Expense Management**: Set monthly budgets and track daily expenses across categories.
- 📈 **AI-Powered Financial Insights**: Integrates **Google Gemini API** to generate monthly personalized insights based on spending behavior.
- 📬 **Budget Alerts via Email**: Sends real-time alerts when spending crosses 80% of budget using scheduled **Inngest** cron jobs.
- 🗕️ **Automated Monthly Reports**: Users receive beautifully designed HTML reports every month summarizing income, expenses, and smart suggestions.
- 🔐 **Secure Auth**: Supports both **JWT-based** login and **Google OAuth2** login with cookie-based sessions.
- 🌗 **Dark Mode + Mobile Friendly**: Fully responsive UI with theme toggling for optimal UX.
- 🔄 **Account Syncing**: Multiple accounts per user, each maintaining independent balances and transaction histories.

---

## ⚙️ Tech Stack

| Technology         | Description                                       |
| ------------------ | ------------------------------------------------- |
| **Frontend**       | React.js, Tailwind CSS, Axios                     |
| **Backend**        | Node.js, Express.js, MongoDB, Mongoose            |
| **Auth**           | JWT, Google OAuth 2.0                             |
| **AI Integration** | Google Gemini API (via Vertex AI or GenAI SDK)    |
| **Email Service**  | Resend + React Email (for templated HTML reports) |
| **CRON Jobs**      | Inngest (serverless function scheduler)           |
| **Dev Tools**      | Vite, Postman, Nodemon, ESLint, Prettier          |

---

## 📷 Screenshots

| Dashboard | Reports | AI Insights |
| --------- | ------- | ----------- |
|           |         |             |

---

## 🧠 AI Financial Insights (Example Output)

```json
[
  "You've spent most on Food & Entertainment. Try allocating a weekly cap.",
  "Your income exceeded expenses — great job! Invest the surplus.",
  "Transport costs are rising. Explore ride-share or carpooling options."
]
```

---

## 📦 Getting Started

```bash
# Clone the repo
git clone https://github.com/yourusername/finlock.git
cd finlock

# Install dependencies
cd frontend && npm install
cd ../backend && npm install

# Environment setup (add your .env variables for API keys, Mongo URI, etc.)
touch .env

# Start the app
npm run dev # from both frontend & backend folders
```

---

## 🔐 .env Configuration (Backend)

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
RESEND_API_KEY=...
```

---

## ✨ Contributing

Pull requests are welcome! For major changes, open an issue first to discuss what you’d like to change.

---

## 👨‍💼 Author

Made with ❤️ by **Abhigyan Srivastava** and **Abhinav Srivastava**\
• [LinkedIn - Abhigyan ](www.linkedin.com/in/abhigyan-srivastava-19609827b)  • [LinkedIn - Abhinav ](https://www.linkedin.com/in/abhinav-srivastava-520438298)

---

## 📄 License

This project is licensed under the MIT License — feel free to use it for learning, personal finance apps, or contributions.

