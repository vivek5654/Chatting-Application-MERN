import mongoose from "mongoose";

const connecDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to the database successfully: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to the database: ${error.message}`);
        process.exit(1);
    }
}

export default connecDB;