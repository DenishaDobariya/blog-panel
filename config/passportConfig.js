const passport = require('passport');
const LocalStrategy = require('passport-local');
const User= require('../models/User');
const expressSession = require('express-session')
const bcrypt = require('bcrypt');


passport.use(new LocalStrategy({ usernameField: 'email' },
    async(username, password, done)=> {
      console.log("passport...",username);
        
      const user= await User.findOne({ email: username });
      console.log("user",user);
      
      if(user){
        bcrypt.compare(password, user.password, async(err, result) =>{
            if(err){
                console.log("err..");
                done(err);
            }

            if(result){
                console.log("success..");
                done(null, user)
            }
            else{
                console.log("err...");
                done(null, false)
            }
        });
      }
      else{
        console.log("error...");
        done(null, false);
      }
    }
  ));

  passport.serializeUser((user, done)=> {
    done(null, user._id);
  });
  
  passport.deserializeUser(async(id, done) =>{
    const user = await User.findById(id);
        if(user){
            done(null, user);
        } 
        else {
            done(null, false);
        }
  });

  module.exports= passport;