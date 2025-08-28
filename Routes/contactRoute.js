import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

// Multer to handle file upload in memory (optional, in case you add file attachment in future)

// Use upload.none() if no file is sent, otherwise use upload.single("fileFieldName")
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, companyName, message } = req.body;

    // Nodemailer transporter using .env
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: process.env.MAIL_SECURE === "true", // true for 465
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.MAIL_TO,
      subject: `New Contact Form Submission: ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Company: ${companyName}
        Message: ${message}
      `,
      html: `<p>You have a new contact form submission:</p>
             <ul>
               <li><strong>Name:</strong> ${name}</li>
               <li><strong>Email:</strong> ${email}</li>
               <li><strong>Phone:</strong> ${phone}</li>
               <li><strong>Company:</strong> ${companyName}</li>
               <li><strong>Message:</strong> ${message}</li>
             </ul>`,
      attachments: [], // empty for now, can be used if you add file upload later
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Contact form sent successfully!" });
  } catch (err) {
    console.error("Email send failed:", err);
    res.status(500).json({ success: false, error: "Failed to send email" });
  }
});

export default router;
