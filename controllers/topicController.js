const Topic = require('../models/Topic');

const renderAddTopic = async (req, res) => {
    try {
        const topics = await Topic.find().populate('createdBy');
        res.render('topic', { topics, user: req.user });
    } catch (err) {
        res.status(500).send('Error retrieving topics');
    }
};

const addTopic = async (req, res) => {
    try {
        console.log('Request Body:', req.body);
        
        if (!req.body.name) {
            return res.status(400).send('Topic name is required');
        }

        const topic = new Topic({
            name: req.body.name,
            createdBy: req.user._id 
        });

        console.log("topic...", topic);
        
        await topic.save();
        res.redirect('/topics');
    } catch (err) {
        console.error('Error adding topic:', err);
        res.status(500).send('Error adding topic');
    }
};


const deleteTopic = async (req, res) => {
    try {
        const topic = await Topic.findById(req.params.id);
        if (!topic) {
            return res.status(404).send('Topic not found');
        }
        
        if (topic.createdBy.equals(req.user._id)) {
            await Topic.deleteOne({ _id: req.params.id });
            res.redirect('/topics');
        } else {
            res.status(403).send('You are not authorized to delete this topic');
        }
    } catch (err) {
        console.error(err); 
        res.status(500).send('Error deleting topic');
    }
};


module.exports = { renderAddTopic, addTopic, deleteTopic };
