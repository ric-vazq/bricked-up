require("dotenv").config()
const axios = require("axios");
const mongoose = require('mongoose');
const OfficialSet = require("../models/OfficialSet.model")

const MONGO_URI = process.env.MONGODB_URI ;

onSuccess = (array) => {
    let newArray = [];
    for (let i = 0; i < array.length; i++) {
        let nm = array[i].name;
        let prtsNum = array[i].num_parts;
        let yr = array[i].year;
        let imageUrl = array[i].set_img_url;
        let setUrl = array[i].set_url;


        newArray.push({name: nm, partNum: prtsNum, year: yr, imgUrl: imageUrl, setUrl: setUrl})
    }
    return newArray
}

mongoose
    .connect(MONGO_URI)
    .then((x) => {
        console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
        return axios.get(`https://rebrickable.com/api/v3/lego/sets/?key=7412840ee8015bc8eed2f0b3dde0a1ec&page=5&page_size=15`);
    })
    .then(APIResponse => {
        let newData = onSuccess(APIResponse.data.results);
        return OfficialSet.insertMany(newData)
    })
    .then(OfficialSetList => {
        console.log("Sets added: ", OfficialSetList);
        return mongoose.connection.close();
    })
    .catch(err => {
        console.log(err);
    })
