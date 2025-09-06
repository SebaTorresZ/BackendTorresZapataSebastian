import mongoose from 'mongoose';

const MONGO_URL = "mongodb+srv://sebatorres:tGW0z6bTbbNQM2Up@cluster0.c1rumnm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("✅ Base de datos conectada");
    } catch (error) {
        console.error("❌ Error al conectar a la base de datos:", error);
        process.exit(1);
    }
};