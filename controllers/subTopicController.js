const SubTopic = require('../models/subTopic');
const Topic = require('../models/Topic');


const addSubTopic = async (req, res) => {
    try {
        const subTopic = new SubTopic({
            name: req.body.name,
            topic: req.body.topic,
            createdBy: req.user._id
        });
        await subTopic.save();
        res.redirect('/subtopics');
    } catch (err) {
        res.status(500).send('Error adding subtopic');
    }
};

const getAllSubTopics = async (req, res) => {
    try {
        const subTopics = await SubTopic.find().populate('topic').populate('createdBy');
        const topics = await Topic.find(); 
        res.render('subTopic', { subTopics, topics, user: req.user  });
    } catch (err) {
        res.status(500).send('Error retrieving subtopics');
    }
};

module.exports = { addSubTopic, getAllSubTopics };
