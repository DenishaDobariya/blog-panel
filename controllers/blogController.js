const Blog = require('../models/Blog');
const fs = require('fs');
const path = require('path');
const Comment = require('../models/Comment');

const getAllBlogs= async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate('author', 'name username')
            .populate({
                path: 'comments',
                populate: { path: 'user', select: 'name' }  
            });

        const comments = await Comment.find()
            .populate('user', 'name')
            .populate('blog', 'title');  
        
        res.render('blog', { blogs, comments, user: req.user, logIn: req.flash('logIn') });
    } catch (error) {
        console.error("Error fetching blogs and comments:", error);
        res.status(500).send('Server Error');
    }
};

const getMyBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ author: req.user.id }).populate('author', 'name username');        
        console.log("User's blogs:", blogs);
        res.render('myBlogs', { blogs , user: req.user });
    } catch (error) {
        console.error("Error fetching user's blogs:", error);
        res.status(500).send('Server Error');
    }
};

const renderAddBlog = (req, res) => {
    res.render('addBlog', { user: req.user });
};

const addBlog = async (req, res) => {
    try {
        const { title, content } = req.body;
        
        if (!title || !content) {
            return res.status(400).send('Title and content are required');
        }
        const blog = new Blog({
            title,
            content,
            author: req.user.id,
            image: req.file ? req.file.path : null 
        });
        
        await blog.save();
        res.redirect('/my-blogs'); 
    } catch (error) {
        console.error("Error adding blog:", error);
        res.status(500).send('Server Error');
    }
};


const renderEditBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        
        if (!blog) {
            return res.status(404).send('Blog not found');
        }
        
        res.render('editBlog', { blog, user: req.user });
    } catch (error) {
        console.error("Error fetching blog for editing:", error);
        res.status(500).send('Server Error');
    }
};

const editBlog = async (req, res) => {
    try {
        const { id } = req.body;
        const blog = await Blog.findById(id); 

        if (!blog) {
            return res.status(404).send('Blog not found'); 
        }

        if (req.file) {
            const oldImagePath = path.join(__dirname, '..', blog.image); 
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath); 
            }
            blog.image = req.file.path; 
        }

        blog.title = req.body.title;
        blog.content = req.body.content;

        await blog.save(); 
        res.redirect('/my-blogs'); 
    } catch (error) {
        console.error("Error updating blog:", error); 
        res.status(500).send('Internal Server Error'); 
    }
};

const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id); 

        if (!blog) {
            return res.status(404).send('Blog not found'); 
        }

        if (blog.image) {
            const imagePath = path.join(__dirname, '..', blog.image); 
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath); 
            }
        }

        await Blog.findByIdAndDelete(req.params.id); 
        res.redirect('/my-blogs'); 
    } catch (error) {
        console.error("Error deleting blog:", error);
        res.status(500).send('Server Error'); 
    }
};

module.exports = { getAllBlogs, getMyBlogs, renderAddBlog, addBlog, renderEditBlog, editBlog, deleteBlog };
