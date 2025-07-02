import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: function() { return !this.googleId && !this.githubId; }, //apenas para login interno
    unique: function() { return !this.googleId && !this.githubId; }, //apenas para login interno
    sparse: true //múltiplos documentos sem username se for login externo
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Por favor, use um e-mail válido.'],
  },
  password: {
    type: String,
    required: function() { return !this.googleId && !this.githubId; }, // Requerido apenas para login interno
    select: false // Não retorna a senha por padrão nas consultas
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Permite múltiplos documentos sem googleId
  },
  githubId: {
    type: String,
    unique: true,
    sparse: true // Permite múltiplos documentos sem githubId
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Define os  papéis do usuário
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware para criptografar a senha antes de salvar 
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  if (this.password) { // Apenas criptografa se a senha estiver presente
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Método para comparar senhas (apenas para login interno)
UserSchema.methods.matchPassword = async function(enteredPassword) {
  if (!this.password) return false; 
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);

export default User;
