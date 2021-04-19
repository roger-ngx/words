const path = require('path');
const fs = require('fs');

const directoryPath = `${path.resolve('./')}/public/uploaded`;

export default function handler(req, res){

    const { projectName, username, fileName } = req.body;

    console.log(`${directoryPath}/${username}/${projectName}/${fileName}`);

    try{
        const file = fs.readFileSync(`${directoryPath}/${username}/${projectName}/${fileName}`);

        console.log(file.toString());

        res.json(file);
    }catch(err){
        console.log(err);
    }
}