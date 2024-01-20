const { Schema, model } = require('mongoose');

const officialSetSchema = new Schema ({
    name: {
        type: String, 
        required: true
    },
    imgUrl: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required:true
    },
    setUrl: {
        type: String,
        required:true

    },
    partNum: {
        type: Number,
        required:true
    }

});

const OfficialSet = model('OfficialSet', officialSetSchema);
module.exports = OfficialSet; 