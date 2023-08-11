const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true, minLength: 3 },
  description: { type: String, required: true, minLength: 3, maxLength: 500 },
});

CategorySchema.virtual('url').get(function () {
  return `categories/${this._id}`;
});

module.exports = mongoose.model('Category', CategorySchema);
