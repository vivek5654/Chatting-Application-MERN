import mongoose from "mongoose";
const connecDB = async () => {
    try{
       const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Conneced to the daabase successfully: ${conn.connection.host}`);
    } catch(error) {
        console.error(`Error connecting to the database: ${conn.connection.host}`);
        process.exit(1); // Exit the process with failure
    }
}

export default connecDB;