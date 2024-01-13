const axios = require("axios");
const mongoose = require('mongoose');
const Part = require("../models/Part.model")
axios
    .get(`https://rebrickable.com/api/v3/lego/sets/11001-1/parts/?key=7412840ee8015bc8eed2f0b3dde0a1ec`)
    .then(response => {
        console.log('Response from API: ', response.data.results);
        let resultsArray = response.data.results
        return resultsArray.forEach((element) => Part.create({name: element.part.name, color: element.color.name, imgUrl: element.part.part_img_url}))
    })
    .catch(err => console.log(err));