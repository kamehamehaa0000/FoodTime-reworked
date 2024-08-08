import passport from 'passport'
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from 'passport-google-oauth20'
import { User } from '../models/user.model'

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/auth/google/callback',
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        let user = await User.findOne({ googleId: profile.id })

        if (!user) {
          const email = profile.emails?.[0].value
          if (!email) {
            return done(
              new Error('Email not available from Google'),
              null as any
            )
          }
          user = await User.create({
            googleId: profile.id,
            email,
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            avatar: profile._json.picture,
          })
        }

        return done(null, user)
      } catch (err) {
        return done(err, null as any)
      }
    }
  )
)

passport.serializeUser((user: any, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch (err) {
    done(err, null as any)
  }
})
