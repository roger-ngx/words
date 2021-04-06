const path = require('path');
const fs = require('fs');
const forEach = require('lodash/forEach');

const directoryPath = `${path.resolve('./')}/public/uploaded`;

export default function handler(req, res){

    const type = req.body.type;

    console.log(`${directoryPath}/${type}`);

    fs.readdir(`${directoryPath}/${type}`, (err, files) => {
        if(err){
            console.log(err);
        }

        res.json(files);
    });
};