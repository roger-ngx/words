import User from "models/user";
import connectDB from "middleware/mongodb";

const handler = async(req, res) => {
    const { username } = req.body;

    console.log('username: ', username);

    if(!username){
        return res.json({message: 'username is empty', err: 1});
    }

    const userDoc = await User.findOne({name: username}).exec();
    if(userDoc){
        return res.json({message: 'username exists', err: 0});
    } else {
        return res.json({message: "username doesn't exists", err: 2});
    }
};

export default connectDB(handler);