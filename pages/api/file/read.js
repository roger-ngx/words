const path = require('path');
const fs = require('fs');

const directoryPath = `${path.resolve('./')}/public/uploaded`;

export default function handler(req, res){

    const { type, name } = req.body;

    fs.readFileSync(`${directoryPath}/${type}/${name}`, (err, file) => {
        if(err){

        }

        res.json(file);
    });
};