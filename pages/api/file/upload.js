import cors from 'middleware/cors';

const micro = require('micro');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

async function handler(req, res){
    await cors(req, res);

    const form = new formidable.IncomingForm({ keepExtensions: true });
    form.parse(req, function (err, fields, files) {
        if (err) return res.err(err);

        const { projectName, username, fileName } = fields;

        const dir = `${path.resolve('./')}/public/uploaded/${username}/${projectName}`;
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }

        const data = fs.readFileSync(files.file.path);

        fs.writeFileSync(`${dir}/${fileName}`, data);
        fs.unlinkSync(files.file.path);

        res.json({ fields });
    });
}

export const config = {
    api: {
      bodyParser: false,
    },
};

export default handler;