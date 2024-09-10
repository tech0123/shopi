import mongoose from "mongoose";

const connectToMongo = async () => {
    if (mongoose.connection.readyState !== 1) { // Only connect if not already connected
        try {
            await mongoose.connect(mongoURI);
            console.log("Connected to MongoDB successfully!");
        } catch (error) {
            console.error("Error connecting to MongoDB:", error.message);
        }
    } else {
        console.log("MongoDB is already connected.");
    }
    mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
    });
    mongoose.connection.on('connected', () => {
        console.log('MongoDB connected');
    });
    mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
    });
    
};

connectToMongo();

export default connectToMongo;
