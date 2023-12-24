const { Schema, model } = require('mongoose');

const setSchema = new Schema ({
    name: {
        type: String, 
        required: true
    },
    imgUrl: {
        type: String
    },
    parts: [{ type: Schema.Types.ObjectId }]
});

const Set = model('Set', setSchema);
module.exports = Set; 