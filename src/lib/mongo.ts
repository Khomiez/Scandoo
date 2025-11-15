import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || '';

if (!MONGO_URI){
    throw new Error("mongo uri is not defined");
}

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(MONGO_URI, {dbName:"scandoo"});
        console.log("mongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error; 
    }
};

export default connectDB;