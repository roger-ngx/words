const { lstatSync, readdirSync } = require('fs')
const { join } = require('path');

const isDirectory = source => lstatSync(source).isDirectory();

const getDirectories = source => readdirSync(source).map(name => join(source, name)).filter(isDirectory)

const directoryPath = `${path.resolve('./')}/public/uploaded`;

export default function handler(req, res){
    const { username } = req.body;

    const source = `${directoryPath}/${username}`;

    const dirs = getDirectories(source);

    console.log(source, dirs);

    res.json(dirs);
}