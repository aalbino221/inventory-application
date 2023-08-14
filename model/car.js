const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CarSchema = new Schema({
  name: { type: String, required: true, maxLength: 100, minLength: 3 },
  description: { type: String, required: true, minLength: 3, maxLength: 500 },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  imgUrl: { type: String },
  added: { type: Date },
});

CarSchema.virtual('url').get(function () {
  return `/cars/${this._id}`;
});

module.exports = mongoose.model('Car', CarSchema);
