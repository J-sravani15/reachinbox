import express from "express";
import cors from "cors";
import session from "express-session";

import testRoutes from "./routes/test.routes";
import authRoutes from "./routes/auth.routes";
import senderRoutes from "./routes/sender.routes";
import campaignRoutes from "./routes/campaign.routes";
import scheduledEmailRoutes from "./routes/scheduled-email.routes";
import emailRoutes from "./routes/email.routes";
import passport from "./services/google.service";
import leadRoutes from "./routes/lead.routes";

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "reachinbox_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", testRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/senders", senderRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use(
  "/api/scheduled-emails",
  scheduledEmailRoutes
);
app.use("/api/emails", emailRoutes);
app.use("/api/leads", leadRoutes);


export default app;