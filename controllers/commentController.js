const Blog = require('../models/Blog');  
const Comment = require('../models/Comment');

const addComment = async (req, res) => {
    try {
        const { comment, blogId } = req.body;

        const newComment = new Comment({
            text: comment,
            user: req.user._id,  
            blog: blogId
        });

        await newComment.save();

        await Blog.findByIdAndUpdate(blogId, { $push: { comments: newComment._id } });

        req.flash('logIn', 'Comment added successfully!');
        res.redirect('/blogs');
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).send('Server Error');
    }
};
module.exports = {addComment}
