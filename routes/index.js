const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('../config/passportConfig'); 
const blogController = require('../controllers/blogController');
const upload = require('../config/imgdb');
const isAuth = require('../middleware/auth'); 
const topicController = require('../controllers/topicController')
const subTopicController = require('../controllers/subTopicController')
const commentController = require('../controllers/commentController');


// Routes for registration
router.get('/register', authController.renderRegister);
router.post('/register', authController.register);
router.get('/login', authController.renderLogin);
router.post('/login', passport.authenticate('local', { 
    failureRedirect: '/login',
    failureFlash: true 
}), authController.login);
router.get('/logout', authController.logout);
router.get('/changePassword', isAuth, authController.changePassword);
router.post('/updatePassword',authController.updatePassword);
router.get('/forgotPassword',authController.forgotPassword);
router.post('/emailCheck',authController.emailCheck);
router.get('/renderOtp/:id',authController.renderOtp);
router.post('/otpCheck/:id',authController.otpCheck);
router.get('/resetPass/:id',authController.resetPass);
router.post('/newPass/:id',authController.newPass);


//Routes for blogs
router.get('/', blogController.getAllBlogs); 
router.get('/blogs', blogController.getAllBlogs); 
router.get('/my-blogs', isAuth, blogController.getMyBlogs);
router.get('/add', isAuth, blogController.renderAddBlog);
router.post('/add', isAuth, upload.single('image'), blogController.addBlog);
router.get('/edit/:id', isAuth, blogController.renderEditBlog);
router.post('/edit', isAuth, upload.single('image'), blogController.editBlog);
router.get('/delete/:id', isAuth, blogController.deleteBlog);

// Topic routes
router.get('/topics', isAuth, topicController.renderAddTopic);
router.post('/add-topic', isAuth, topicController.addTopic);
router.get('/deleteTopic/:id', isAuth, topicController.deleteTopic);

// SubTopic routes
router.get('/subtopics', isAuth, subTopicController.getAllSubTopics);
router.post('/add-subtopic', isAuth, subTopicController.addSubTopic);

// Comment routes
router.post('/blogs/:blogId/add-comment', isAuth, commentController.addComment)

module.exports = router;
