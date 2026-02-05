import mongoose from 'mongoose';

const connectDB = async () => {
    try{
        // const conn = await mongoose.connect(process.env.MONGO_URI!); // ! at the end says that its not undefined since typescript does not know if MONGO_URI exist in env or not
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI not defined in .env');
        }
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch(error){
        console.log(`MongoDB connection error: ${error}`);
        process.exit(1);
    }
};

export default connectDB;