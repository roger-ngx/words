import mongoose from 'mongoose';

const connectDB = handler => async (req, res) => {
    if(mongoose.connections[0].readyState){
        return handler(req, res);
    }

    await mongoose.connect(process.env.MONGO_DB_URL, {
        useUnifiedTopology: true,
        useFindAndModify: true,
        useCreateIndex: true,
        useNewUrlParser: true
    });
    return handler(req, res);
};

export default connectDB;