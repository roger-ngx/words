import User from "models/user";
import connectDB from "middleware/mongodb";

const handler = async(req, res) => {
    const { username } = req.body;

    console.log('username: ', username);

    if(!username){
        return res.json({message: 'usename is empty', err: 1});
    }

    const userDoc = await User.findOne({name: username}).exec();
    if(userDoc){
        return res.json({message: 'usename does exists', err: 2});
    } else {
        User.create({name: username}, (err, user) => {
            if(err){
                return res.json({message: err, err: 3});
            }

            return res.json({message: JSON.stringify(user), err: 0});
        });
    }
};

export default connectDB(handler);