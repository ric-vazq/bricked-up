const axios = require("axios");
const mongoose = require('mongoose');
const Part = require("../models/Part.model")
axios
    .get(`https://rebrickable.com/api/v3/lego/sets/11002-1/parts/?key=${process.env.REBRICK_KEY}`)
    .then(response => {
        console.log('Response from API: ', response.data.results);
        let resultsArray = response.data.results
        return resultsArray.forEach((element) => Part.create({name: element.part.name, color: element.color.name, imgUrl: element.part.part_img_url}))
    })
    .catch(err => console.log(err));