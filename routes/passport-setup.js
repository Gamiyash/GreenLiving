
const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const User = require('../models/User'); // Adjust the path if needed

// passport.use(
//     new GoogleStrategy({
//         clientID: '842221258051-f7t4bbu050f6cskhj4eimuhrugqol53k.apps.googleusercontent.com',
//         clientSecret: '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',
//         callbackURL: 'http://localhost:3000/auth/google/callback'
//     },
//         async (accessToken, refreshToken, profile, done) => {
//             const existingUser = await User.findOne({ googleId: profile.id });

//             if (existingUser) {
//                 return done(null, existingUser);
//             }

//             const newUser = new User({ googleId: profile.id, username: profile.displayName });
//             await newUser.save();
//             done(null, newUser);
//         })
// );

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


// passport.use(
//     new GoogleStrategy({
//         clientID: '842221258051-f7t4bbu050f6cskhj4eimuhrugqol53k.apps.googleusercontent.com',
//         clientSecret: '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',
//         callbackURL: 'http://localhost:3000/auth/google/callback'
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       const existingUser = await User.findOne({ googleId: profile.id });

//       if (existingUser) {
//         return done(null, existingUser);
//       }

//       // Ensure to include necessary fields
//       const newUser = new User({
//         googleId: profile.id,
//         username: profile.displayName,
//         email: profile.emails[0].value // If using email from Google profile
//         // Include password only if needed, or leave it out for Google-based logins
//       });

//       await newUser.save();
//       done(null, newUser);
//     })
//   );

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User'); // Adjust the path if needed

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



passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});
