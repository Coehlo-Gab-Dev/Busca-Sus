// src/config/db.js
import mongoose from 'mongoose';
import 'dotenv/config';

/**
 * Conecta-se ao banco de dados MongoDB usando Mongoose.
 * A URL de conexão é obtida das variáveis de ambiente.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erro ao conectar ao MongoDB: ${error.message}`);
    process.exit(1); // Sai do processo com falha
  }
};

export default connectDB;
