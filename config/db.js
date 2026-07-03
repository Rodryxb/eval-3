const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/evaluacion3';
    await mongoose.connect(uri);
    console.log('MongoDB conectado correctamente ->', uri);
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = conectarDB;
