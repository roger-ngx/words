import mongoose from 'mongoose';

const connectDB = handler => async (req, res) => {
    if(mongoose.connections[0].readyState){
        return handler(req, res);
    }

    await mongoose.connect('mongodb+srv://thanh:thanh@cluster0.61tgr.mongodb.net/words?retryWrites=true&w=majority', {
        useUnifiedTopology: true,
        useFindAndModify: true,
        useCreateIndex: true,
        useNewUrlParser: true
    });
    return handler(req, res);
};

export default connectDB;