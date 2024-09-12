import mongoose, { connection } from 'mongoose';

const DB_PASSWORD = process.env.DB_PASSWORD
const DB_USERNAME = process.env.DB_USERNAME
const mongoURI = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.csq7air.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"`;

const connectToMongo = async () => {
    if (connection.isConnected) {
        console.log('----------------------------- Already Connected -----------------------------')
        return
    }
    try {
        const db = await mongoose.connect(mongoURI || "");
        connection.isConnected = db.connections[0].readyState
        console.log("Connected to MongoDB successfully!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1)
    }
};

export default connectToMongo;