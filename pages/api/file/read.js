const path = require('path');
const fs = require('fs');

const directoryPath = `${path.resolve('./')}/public/uploaded`;

export default function handler(req, res){

    const { type, name } = req.body;

    console.log(`${directoryPath}/${type}/${name}`);

    try{
        const file = fs.readFileSync(`${directoryPath}/${type}/${name}`);

        console.log(file.toString());

        res.json(file);
    }catch(err){
        console.log(err);
    }
}