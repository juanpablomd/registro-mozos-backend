import { Router } from 'express';
import DiaTrabajado from '../models/DiaTrabajado.js';

const router = Router();

const PAGO_HORA = 3494;

function calcularHoras(inicio, fin) {
  const [hi, mi] = inicio.split(':').map(Number);
  const [hf, mf] = fin.split(':').map(Number);

  let inicioMin = hi * 60 + mi;
  let finMin = hf * 60 + mf;

  if (finMin <= inicioMin) {
    finMin += 24 * 60;
  }

  return (finMin - inicioMin) / 60;
}

// Crear día
router.post('/', async (req, res) => {
  try {
    const {
      fecha,
      horaLlegada,
      horaSalida,
      propina = 0,
      gastoTransporte = 0
    } = req.body;

    const horasTrabajadas = calcularHoras(horaLlegada, horaSalida);
    const pagoBase = horasTrabajadas * PAGO_HORA;
    const gananciaNeta = pagoBase + propina - gastoTransporte;

    const dia = await DiaTrabajado.create({
      fecha,
      horaLlegada,
      horaSalida,
      horasTrabajadas,
      pagoBase,
      propina,
      gastoTransporte,
      gananciaNeta
    });

    res.status(201).json(dia);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el día' });
  }
});

// Obtener todos
router.get('/', async (req, res) => {
  const dias = await DiaTrabajado.find().sort({ fecha: -1 });
  res.json(dias);
});

// Eliminar
router.delete('/:id', async (req, res) => {
  await DiaTrabajado.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

// Editar día
router.put('/:id', async (req, res) => {
  try {
    const {
      fecha,
      horaLlegada,
      horaSalida,
      propina = 0,
      gastoTransporte = 0
    } = req.body;

    const horasTrabajadas = calcularHoras(horaLlegada, horaSalida);
    const pagoBase = horasTrabajadas * PAGO_HORA;
    const gananciaNeta = pagoBase + propina - gastoTransporte;

    const diaActualizado = await DiaTrabajado.findByIdAndUpdate(
      req.params.id,
      {
        fecha,
        horaLlegada,
        horaSalida,
        horasTrabajadas,
        pagoBase,
        propina,
        gastoTransporte,
        gananciaNeta
      },
      { new: true }
    );

    if (!diaActualizado) {
      return res.status(404).json({ error: 'Día no encontrado' });
    }

    res.json(diaActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el día' });
  }
});

export default router;
