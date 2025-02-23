import express from "express";
import { google } from "googleapis";
import type { RequestHandler } from "express";
import Session from "express-session";

interface SendEmailBody {
  to: string;
  subject: string;
  body: string;
}

// Extend express-session types
declare module "express-session" {
  interface SessionData {
    accessToken?: string;
    refreshToken?: string;
  }
}

const REFRESH_TOKEN_hardocded =
  "1//0gNOEWA6guGC3CgYIARAAGBASNgF-L9IrPIkgVMwl8-qiD9ZnWWFKxqCZuLaM3kj2iB9ZbBOrlvli1hnV4Lei5xXykjZUWNUSTw";

const router = express.Router();

router.get("/check-token", async (req, res) => {
  const checkToken = async () => {
    try {
      const accessToken = req.session.accessToken;
      console.log(accessToken);

      if (!accessToken) {
        return res.status(401).json({ error: "No token found" });
      }
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.REDIRECT_URI || "http://localhost:5173"
      );

      oauth2Client.setCredentials({ access_token: accessToken });

      const gmail = google.gmail({ version: "v1", auth: oauth2Client });
      await gmail.users.getProfile({ userId: "me" });

      res.json({ valid: true });
    } catch (error) {
      console.log(error);

      req.session.accessToken = undefined;
      res.status(401).json({ error: "Invalid token" });
    }
  };
  checkToken();
});

// Store token endpoint
router.post("/store-token", async (req, res) => {
  try {
    const { code } = req.body;
    console.log("req.body", req.body);
    // console.log("code", code);
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.REDIRECT_URI || "http://localhost:5173"
    );

    const { tokens } = await oauth2Client.getToken(code);
    console.log("Tokens from oauth2Client", tokens);

    // Store tokens, handling potential null values
    req.session.accessToken = tokens.access_token || undefined;
    req.session.refreshToken = tokens.refresh_token || undefined;

    // Same for the tokens event handler
    oauth2Client.on("tokens", (tokens) => {
      if (tokens.refresh_token) {
        req.session.refreshToken =
          tokens.refresh_token || REFRESH_TOKEN_hardocded || undefined;
      }
      req.session.accessToken = tokens.access_token || undefined;
    });

    res.json({ message: "Authentication successful" });
  } catch (error) {
    console.error("Token exchange error:", error);
    res.status(500).json({ error: "Failed to authenticate" });
  }
});

const sendEmailHandler: RequestHandler = async (req, res): Promise<void> => {
  try {
    // const { to, subject, body } = req.body as SendEmailBody;

    if (!req.session?.accessToken) {
      res.status(401).json({ error: "No access token found" });
      return;
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.REDIRECT_URI
    );

    oauth2Client.setCredentials({
      access_token: req.session.accessToken,
      refresh_token: req.session.refreshToken,
    });

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString(
    const utf8Subject = `=?utf-8?B?${Buffer.from("this is a subject").toString(
      "base64"
    )}?=`;
    const messageParts = [
      `To: developer.deepak25@gmail.com`,
      // `To: ${to}`,
      "Content-Type: text/plain; charset=utf-8",
      "MIME-Version: 1.0",
      `Subject: ${utf8Subject}`,
      "",
      // body,
      "this is supposed to be the body",
    ];
    const message = messageParts.join("\n");

    const encodedMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const result = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });

    res.json(result.data);
  } catch (error: any) {
    console.error("Error sending email:", error);
    if (error.code === 401) {
      req.session.accessToken = undefined;
      res.status(401).json({ error: "Authentication required" });
    } else {
      res.status(500).json({ error: "Failed to send email" });
    }
  }
};

router.post("/send-email", sendEmailHandler);

export default router;
