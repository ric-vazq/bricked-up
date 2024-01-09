const { Schema, model } = require('mongoose');

const setSchema = new Schema ({
    name: {
        type: String, 
        required: true
    },
    imgUrl: {
        type: String
    },
    parts: [{ type: Schema.Types.ObjectId, ref: 'Part' }],
    creators: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    instructions: [ String ]
});

const Set = model('Set', setSchema);
module.exports = Set; 