const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { validarRut } = require('../utils/rutValidator');

const { Schema } = mongoose;

// Subdocumento: Direccion
const direccionSchema = new Schema(
  {
    comuna: {
      type: String,
      required: [true, 'La comuna es obligatoria'],
      trim: true
    },
    calle: {
      type: String,
      required: [true, 'La calle es obligatoria'],
      trim: true
    },
    numero: {
      type: String,
      required: [true, 'El número es obligatorio'],
      trim: true
    },
    departamentoOficina: {
      type: String,
      trim: true,
      default: ''
    }
  },
  { _id: false }
);

const usuarioSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true
    },
    rut: {
      type: String,
      required: [true, 'El RUT es obligatorio'],
      unique: true,
      trim: true,
      validate: {
        validator: validarRut,
        message: (props) => `${props.value} no es un RUT chileno válido`
      }
    },
    correo: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[\w.-]+@[\w.-]+\.\w+$/, 'El correo no tiene un formato válido']
    },
    telefono: {
      type: String,
      trim: true,
      default: ''
    },
    fechaNacimiento: {
      type: Date,
      validate: {
        validator: function (valor) {
          if (!valor) return true; // no es obligatorio
          return valor instanceof Date && !isNaN(valor) && valor < new Date();
        },
        message: 'La fecha de nacimiento debe ser una fecha válida anterior a la fecha actual'
      }
    },
    nacionalidad: {
      type: String,
      required: [true, 'La nacionalidad es obligatoria'],
      uppercase: true,
      trim: true,
      match: [/^[A-Z]{2}$/, 'La nacionalidad debe ser un código ISO-3166 Alpha-2 (ej: CL, AR, PE)']
    },
    genero: {
      type: String,
      uppercase: true,
      trim: true,
      enum: {
        values: ['M', 'F', 'O'],
        message: 'El género debe ser M, F u O'
      }
    },
    direccion: {
      type: direccionSchema,
      required: [true, 'La dirección es obligatoria']
    },
    contrasena: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      select: false // no se retorna por defecto en las consultas
    },
    fechaRegistro: {
      type: Date,
      default: Date.now
    },
    activo: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: false,
    collection: 'usuarios'
  }
);

// Hash de la contraseña antes de guardar (bcrypt)
usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('contrasena')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.contrasena = await bcrypt.hash(this.contrasena, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Hash de contraseña también en findOneAndUpdate si viene en el body
usuarioSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  if (update && update.contrasena) {
    const salt = await bcrypt.genSalt(10);
    update.contrasena = await bcrypt.hash(update.contrasena, salt);
    this.setUpdate(update);
  }
  next();
});

// Método de instancia para comparar contraseñas
usuarioSchema.methods.compararContrasena = function (contrasenaPlano) {
  return bcrypt.compare(contrasenaPlano, this.contrasena);
};

module.exports = mongoose.model('Usuario', usuarioSchema);
