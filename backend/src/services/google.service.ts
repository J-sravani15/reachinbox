import prisma from "../config/prisma";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

if (!email) {
  return done(new Error("Email not found"));
}

let user = await prisma.user.findUnique({
  where: {
    email,
  },
});

if (!user) {
  user = await prisma.user.create({
    data: {
      googleId: profile.id,
      name: profile.displayName,
      email,
      avatar: profile.photos?.[0]?.value,
    },
  });
}

return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

export default passport;