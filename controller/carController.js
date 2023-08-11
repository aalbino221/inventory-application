const Car = require('../model/car');
const asyncHandler = require('express-async-handler');

exports.index = asyncHandler(async (req, res, next) => {
  const cars = await Car.find().sort({ added: -1 }).limit(4);
  res.render('index', { title: 'DriveCar', cars });
});
