import mongoose from "mongoose";
let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDb = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error("MONGODB_URI is not set in environment");
    }

    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(uri, {
                serverSelectionTimeoutMS: 5000,
                maxPoolSize: 10,
            })
            .then((mongoose) => {
                console.log("MongoDB connected");
                return mongoose;
            })
            .catch((err) => {
                console.error("MongoDB connection error:", err.message);
                throw err;
            });
    }
    cached.conn = await cached.promise;
    return cached.conn;
};
export default connectDb;
