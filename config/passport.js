const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User'); // Adjust the path if needed
const sendLoginEmail = require('../routes/mailer.js');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;

      if (!email) {
        return done(new Error('No email found in Google profile'));
      }

      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        user = await User.findOne({ email: email });

        if (user) {
          // Update the existing user with the Google ID
          user.googleId = profile.id;
          await user.save();
        } else {
          // Create a new user if no existing user with the email is found
          user = new User({
            googleId: profile.id,
            username: profile.displayName,
            email: email
          });
          await user.save();
        }
      }

      // Send login email
      sendLoginEmail(email, user.username);

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const User = require('../models/User'); // Adjust the path if needed

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: 'http://localhost:3000/auth/google/callback'
//   },
//   async (accessToken, refreshToken, profile, done) => {
//     try {
//       const email = profile.emails[0].value;

//       if (!email) {
//         return done(new Error('No email found in Google profile'));
//       }

//       let user = await User.findOne({ googleId: profile.id });

//       if (!user) {
//         user = await User.findOne({ email: email });

//         if (user) {
//           // Update the existing user with the Google ID
//           user.googleId = profile.id;
//           await user.save();
//         } else {
//           // Create a new user if no existing user with the email is found
//           user = new User({
//             googleId: profile.id,
//             username: profile.displayName,
//             email: email
//           });
//           await user.save();
//         }
//       }

//       done(null, user);
//     } catch (error) {
//       done(error, null);
//     }
//   }
// ));

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (error) {
//     done(error, null);
//   }
// });
