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
    owner: [{ type: Schema.Types.ObjectId, ref: 'User'}]
});

const Set = model('Set', setSchema);
module.exports = Set; 