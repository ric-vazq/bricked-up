const { Schema, model } = require('mongoose');

const partSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    imgUrl: {
        type: String,
        required: true
    }
});

const Part = model('Part', partSchema);

module.exports = Part; 