const path = require('path');
const fs = require('fs');
const forEach = require('lodash/forEach');

const directoryPath = `${path.resolve('./')}/public/uploaded`;

export default function handler(req, res){

    const {projectName, username} = req.body;

    const dir = `${directoryPath}/${username}/${projectName}`;

    fs.readdir(dir, (err, files) => {
        if(err){
            console.log(err);
        }

        res.json(files);
    });
};