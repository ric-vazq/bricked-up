const axios = require("axios");
const mongoose = require('mongoose');
const Part = require("../models/Part.model")

const MONGO_URI = process.env.MONGODB_URI ;

onSuccess = (array) => {
    let newArray = [];
    for (let i = 0; i < array.length; i++) {
        let nm = array[i].part.name;
        let clr = array[i].color.name;
        let imageUrl = array[i].part.part_img_url;

        newArray.push({name: nm, color: clr, imgUrl: imageUrl})
    }
    return newArray
}

mongoose
    .connect(MONGO_URI)
    .then((x) => {
        console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
        return axios.get(`https://rebrickable.com/api/v3/lego/sets/11001-1/parts/?key=7412840ee8015bc8eed2f0b3dde0a1ec`);
    })
    .then(APIResponse => {
        let newData = onSuccess(APIResponse.data.results);
        return Part.insertMany(newData)
    })
    .then(partsList => {
        console.log("Parts added: ", partsList);
        return mongoose.connection.close();
    })
    .catch(err => {
        console.log(err);
    })

