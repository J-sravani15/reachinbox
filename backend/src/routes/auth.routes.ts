import { Router } from "express";
import passport from "../services/google.service";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: true,
  }),
  (req, res) => {
    res.json({
      success: true,
      user: req.user,
    });
  }
);

export default router;