import runCors from 'middleware/cors';
import NextCors from 'nextjs-cors';

const micro = require('micro');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
import nc from "next-connect";
import cors from "cors";

const handler = nc()
  // use connect based middleware
.use(cors())
.post(async (req, res) => {
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
});

// async function handler(req, res){
//     // await runCors(rq, res);

//     await NextCors(req, res, {
//         // Options
//         methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
//         origin: '*',
//         optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
//      });

//     const form = new formidable.IncomingForm({ keepExtensions: true });
//     form.parse(req, function (err, fields, files) {
//         if (err) return res.err(err);

//         const { projectName, username, fileName } = fields;

//         const dir = `${path.resolve('./')}/public/uploaded/${username}/${projectName}`;
//         if(!fs.existsSync(dir)){
//             fs.mkdirSync(dir, { recursive: true });
//         }

//         const data = fs.readFileSync(files.file.path);

//         fs.writeFileSync(`${dir}/${fileName}`, data);
//         fs.unlinkSync(files.file.path);

//         res.json({ fields });
//     });
// }

export const config = {
    api: {
      bodyParser: false,
    },
};

export default handler;