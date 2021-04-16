const path = require('path');
const fs = require('fs');
const forEach = require('lodash/forEach');

const directoryPath = `${path.resolve('./')}/public/uploaded`;

export default function handler(req, res){

    const {type, user} = req.body;

    console.log(`${directoryPath}/${type}/${user}`);

    fs.readdir(`${directoryPath}/${type}`, (err, files) => {
        if(err){
            console.log(err);
        }

        res.json(files);
    });
};