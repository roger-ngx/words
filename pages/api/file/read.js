const path = require('path');
const fs = require('fs');

const directoryPath = `${path.resolve('./')}/public/uploaded`;

export default function handler(req, res){

    const { type, user, fileName } = req.body;

    console.log(`${directoryPath}/${type}/${user}/${fileName}`);

    try{
        const file = fs.readFileSync(`${directoryPath}/${type}/${user}/${fileName}`);

        console.log(file.toString());

        res.json(file);
    }catch(err){
        console.log(err);
    }
}