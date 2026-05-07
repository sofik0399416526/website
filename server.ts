import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for placing orders and sending email
  app.post("/api/orders", async (req, res) => {
    const { orderDetails, customerInfo } = req.body;

    console.log("New Order Request:", { orderDetails, customerInfo });

    try {
      // Setup Nodemailer
      // We use Gmail service as a common default. 
      // User needs to provide EMAIL_USER and EMAIL_PASS (Gmail App Password)
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const itemsHtml = orderDetails.items.map((item: any) => 
        `<li>${item.name} - ${item.price} TK x ${item.quantity || 1}</li>`
      ).join('');

      const ownerEmail = process.env.OWNER_EMAIL || "sofik0399416526@gmail.com";

      const mailOptions = {
        from: `"Fresh Market Orders" <${process.env.EMAIL_USER || 'order@freshmarket.com'}>`,
        to: ownerEmail,
        subject: `New Order from ${customerInfo.name}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h1 style="color: #059669;">New Order Received!</h1>
            <hr />
            <h3>Customer Details:</h3>
            <p><strong>Name:</strong> ${customerInfo.name}</p>
            <p><strong>Phone:</strong> ${customerInfo.phone}</p>
            <p><strong>Address:</strong> ${customerInfo.address}</p>
            <p><strong>Payment Method:</strong> ${customerInfo.paymentMethod.toUpperCase()}</p>
            
            <hr />
            <h3>Order Items:</h3>
            <ul>${itemsHtml}</ul>
            <p style="font-size: 1.25rem;"><strong>Total Amount: <span style="color: #059669;">${orderDetails.total} TK</span></strong></p>
            <hr />
            <p style="color: #666; font-size: 0.875rem;">This is an automated notification from your Fresh Market website.</p>
          </div>
        `
      };

      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully to:", ownerEmail);
        res.status(200).json({ success: true, message: "Order placed and email sent" });
      } else {
        console.warn("EMAIL_USER or EMAIL_PASS not set. Email not sent.");
        res.status(200).json({ 
          success: true, 
          message: "Order placed successfully! (Email notification was skipped - please set EMAIL_USER and EMAIL_PASS constants in the admin settings)." 
        });
      }

    } catch (error) {
      console.error("Error processing order:", error);
      res.status(500).json({ error: "Failed to process order. Please try again." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
