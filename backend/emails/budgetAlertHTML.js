// emails/budgetAlertHtml.js

function budgetAlertHtml({ userName = "", data = {} }) {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; background: #f1f5f9; padding: 40px 0;">
        <div style="background: #fff; border-radius: 10px; padding: 40px; max-width: 600px; margin: auto; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0;">
          <h2 style="text-align: center; color: #1e293b;">⚠ Budget Alert from Finlock</h2>
          <p style="color: #334155;">Hello <strong>${userName}</strong>,</p>
          <p style="color: #334155;">You've used <strong>${data?.percentageUsed}%</strong> of your monthly budget. Here's a breakdown:</p>
          <div style="background: #f9fafb; padding: 24px; border-radius: 8px; border: 1px solid #e2e8f0; margin-top: 24px;">
            <p><strong>💰 Budget Limit:</strong> ₹ ${data?.budgetAmount}</p>
            <p><strong>🧾 Spent So Far:</strong> ₹ ${data?.totalExpenses}</p>
            <p><strong>📉 Remaining:</strong> ₹ ${data?.budgetAmount - data?.totalExpenses}</p>
          </div>
          <p style="margin-top: 20px;">To maintain your financial goals, we recommend reviewing your expenses and adjusting accordingly.</p>
          <a href="http://localhost:3001/dashboard" style="display: inline-block; margin-top: 24px; background: #1e293b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View My Dashboard</a>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 32px; text-align: center;">You're receiving this email because you have an active budget set on Finlock.<br>© ${new Date().getFullYear()} Finlock</p>
        </div>
      </body>
    </html>
  `;
}

module.exports = { budgetAlertHtml };
