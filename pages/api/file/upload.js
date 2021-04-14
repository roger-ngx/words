const micro = require('micro');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

async function handler(req, res){
    const form = new formidable.IncomingForm({ keepExtensions: true });
    form.parse(req, function (err, fields, files) {
        if (err) return res.err(err);

        const fileName = fields.name;
        const dataType = fields.type;

        const data = fs.readFileSync(files.file.path);

        fs.writeFileSync(`${path.resolve('./')}/public/uploaded/${dataType}/${fileName}`, data);
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