import mongoose from "mongoose";
import "colors";

const globalAny = global;
let cached = globalAny.mongoose;

if (!cached) {
  cached = globalAny.mongoose = { conn: null, promise: null };
}

const connection = async () => {
  if (cached.conn) return cached.conn;

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined!");
  }

  try {
    if (!cached.promise) {
      cached.promise = mongoose.connect(process.env.MONGO_URI, {
        maxPoolSize: 20,
        serverSelectionTimeoutMS: 5000, // fail fast
        socketTimeoutMS: 20000,
      });
    }

    cached.conn = await cached.promise;

    console.log(
      `Database connected: ${mongoose.connection.host}`.bgMagenta
    );

    return cached.conn;
  } catch (error) {
    console.error(`DB connection error: ${error.message}`.bgRed.white);
    process.exit(1);
  }
};

export default connection;
