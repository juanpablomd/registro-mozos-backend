import mongoose from 'mongoose';

const DiaTrabajadoSchema = new mongoose.Schema({
  fecha: {
    type: String,
    required: true
  },
  horaLlegada: String,
  horaSalida: String,

  horasTrabajadas: Number,

  pagoHora: {
    type: Number,
    default: 3494
  },
  pagoBase: Number,

  propina: {
    type: Number,
    default: 0
  },
  gastoTransporte: {
    type: Number,
    default: 0
  },

  gananciaNeta: Number
}, { timestamps: true });

export default mongoose.model('DiaTrabajado', DiaTrabajadoSchema);
