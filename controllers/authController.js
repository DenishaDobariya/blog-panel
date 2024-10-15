const User = require('../models/User'); 
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');

const saltRounds = 8;
let myOtp = null;

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: 'gmail',
    auth: {
      user: "cs2115.assc@gmail.com",
      pass: "pxyh fpij gfym pgws",
    },
  });

const renderRegister = (req, res) => {
    res.render('register');
};

const register = async (req, res) => {
    if (req.body.password === req.body.confirmPassword) {
        bcrypt.hash(req.body.password, saltRounds, async function (err, hashPass) {
            console.log("hashed Password : ", hashPass);

            if (!err) {
                const signUpUser = await new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: hashPass,
                    resetToken :null
                });
                console.log("USER", signUpUser);
                const createdUser = await signUpUser.save();
                console.log("SignUp user : ", createdUser);
                res.redirect('/login');
            }
            else{
                console.error("Error hashing password:", err);
                return res.redirect('/register'); 
            }
        });
    } 
    else {
        console.log("Passwords do not match.");
        res.redirect('/register');
    }
};

const renderLogin = (req, res) => {
    if (req.isAuthenticated()) {
        console.log("user is already login");
        res.redirect('/blogs'); 
    } else {
        console.log("please login...");
        res.render('login'); 
    }
};

const login = (req, res) => {
    console.log("success login..."); 
    req.flash('logIn', 'welcome...!')
    res.redirect('/blogs'); 
};

const logout = (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); } 
        res.redirect('/login'); 
    });
};

const changePassword = (req,res) =>{
    res.render('changePassword')
}

const updatePassword = async (req,res) =>{
    const {password} = req.user;
    const {currentPassword, newPassword, confirmPassword} = req.body;

    bcrypt.compare(currentPassword, password, async(err, result)=>{
        if(result){
            console.log("password match...");
            if(newPassword === confirmPassword){
                bcrypt.hash(newPassword, saltRounds, async(err,hashPass)=>{
                    if(err){
                        res.redirect("/changePaswword")
                    }
                    const hashPassword = await User.updateOne({_id: req.user.id},{password:hashPass});
                    res.redirect('/')
                } )
            }
            else{
                console.log("password not match...");
                res.redirect("/changePaswword")
            }
        }
        else{
            console.log("incorrect password...");
            res.redirect("/changePassword")
        }
    })
}

const forgotPassword = (req, res)=>{
    res.render('forgotPassword')
}

const emailCheck = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {

            let token = randomstring.generate();
            console.log("token...", token);

            const updatedToken = await User.updateOne({email:req.body.email}, {resetToken: token});
            console.log("after update token...",updatedToken);
            

            //using email link
            let link = `http://localhost:3003/resetPass/${user._id}`;
            console.log("Reset link ->>> ", link);
            res.send('Password reset link has been sent.');

            //using otp
            // let otp = otpGenerator.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
            // console.log("otp", otp);
            // myOtp = otp;
            // res.redirect(`/renderOtp/${user._id}`);

            const info = await transporter.sendMail({
                from: 'cs2115.assc@gmail.com', 
                to: user.email, 
                subject: 'Reset Password Link',
                html: `<p>Reset your password by clicking the link: <a href="">${link}</a></p>`,
            });
            
            console.log("Message sent: %s", info.messageId);

        } else {
            console.log("User not exist...");
            res.redirect('/register');
        }
    } catch (error) {
        console.log("Error during email check:", error);
        res.status(500).send('Server error');
    }
}

const renderOtp = (req,res) =>{
    const { id } = req.params;  
    res.render('otpCheck', { id }); 
}

const otpCheck = async(req,res)=>{
    const {otp} = req.body;
    const { id } = req.params;
    if(otp == myOtp){
        res.redirect(`/resetPass/${id}`)
    }
    else{
        console.log("Incorrect OTP");
        res.redirect(`/renderOtp/${id}`);
    }
}

const resetPass = async (req, res) => {
    const { id } = req.params;
    
    try {
        if (id) {
            const userId = await User.findOne({ _id: id });
            if (userId) {
                if(userId.resetToken){
                    res.render('resetPassword', { id });
                }
                else{
                    res.send('error...')
                }
            } else {
                console.log("User not found...");
                res.status(404).send('User not found.');
            }
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.log("Error during reset password flow:", error);
        res.status(500).send('Server error');
    }
}



const newPass = async(req,res)=>{
    const {id} = req.params;
    const {newPass, confPass} = req.body;

    if(newPass == confPass){
        bcrypt.hash(newPass, saltRounds, async(err,hashPass)=>{
            if(err){
                res.redirect(`/resetPass/${id}`)
            }
            const newHashPass = await User.updateOne({_id: id},{password:hashPass, resetToken:null});
            console.log("new pass", newHashPass);
            // res.redirect('/login')
            if(newHashPass){
                res.redirect('/');
            }
        } )
    }
    else{
        console.log("incorrect password...");
        res.redirect(`/resetPass/${id}`)
    }
}

module.exports = { renderRegister, register, renderLogin, login, logout, changePassword, updatePassword, forgotPassword, emailCheck, renderOtp, otpCheck, resetPass, newPass};
