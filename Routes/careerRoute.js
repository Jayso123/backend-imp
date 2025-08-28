import express from "express";
import multer from "multer";
import nodemailer from "nodemailer";

const router = express.Router();

// Multer to handle file upload in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", upload.single("resume"), async (req, res) => {
  try {
    const { name, email, phone, coverLetter, experience } = req.body;
    const resumeFile = req.file;

    // 🔹 Nodemailer config using .env
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST, // e.g. mail.impetustechno.com
      port: process.env.MAIL_PORT, // 465 or 587
      secure: process.env.MAIL_SECURE === "true", // true if using 465
      auth: {
        user: process.env.MAIL_USER, // contact@impetustechno.com
        pass: process.env.MAIL_PASS, // your email password
      },
    });

    const mailOptions = {
      from: `"Career Portal" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO, // HR inbox
      subject: `New Job Application: ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Experience: ${experience}
        Cover Letter: ${coverLetter}
      `,
      attachments: resumeFile
        ? [
            {
              filename: resumeFile.originalname,
              content: resumeFile.buffer,
            },
          ]
        : [],
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Application sent to email!" });
  } catch (err) {
    console.error("Email send failed:", err);
    res.status(500).json({ success: false, error: "Failed to send email" });
  }
});

export default router;
