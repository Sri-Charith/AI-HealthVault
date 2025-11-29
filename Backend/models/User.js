const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },

  goals:    { type: [String], required: true },
  age:      { type: Number, required: true },
  gender:   { type: String, required: true },
  height:   { type: Number, required: true },
  weight:   { type: Number, required: true },
  focus:    { type: String, required: true },
  diet:     { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
