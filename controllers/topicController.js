const Topic = require('../models/Topic');

const renderAddTopic = async (req, res) => {
    try {
        res.render('topic',{  user: req.user });
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
            name: req.body.name
        });

        console.log("topic...", topic);
        
        await topic.save();
        res.redirect('/topics');
    } catch (err) {
        console.error('Error adding topic:', err);
        res.status(500).send('Error adding topic');
    }
};


module.exports = { renderAddTopic, addTopic };
