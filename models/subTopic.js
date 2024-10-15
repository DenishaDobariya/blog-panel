const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subTopicSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

const SubTopic = mongoose.model('SubTopic', subTopicSchema);

module.exports = SubTopic ;