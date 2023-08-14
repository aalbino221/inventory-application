const Car = require('../model/car');
const Category = require('../model/category');
const asyncHandler = require('express-async-handler');

exports.index = asyncHandler(async (req, res, next) => {
  const cars = await Car.find().sort({ added: -1 }).limit(4);
  res.render('index', { title: 'DriveCar', cars });
});

exports.car_detail = asyncHandler(async (req, res, next) => {
  const car = await Car.findById(req.params.id).populate('category');
  res.render('car_details', { title: car.name, car });
});

exports.browse = asyncHandler(async (req, res, next) => {
  const carList = await Car.find();
  res.render('browse', { title: 'Browse', carList });
});

exports.newCar_get = asyncHandler(async (req, res, next) => {
  const categoriesList = await Category.find().sort({ name: 1 });
  res.render('newCar_get', { title: 'New Car', categoriesList });
});

exports.updateCar_get = asyncHandler(async (req, res, next) => {
  const [car, categoriesList] = await Promise.all([
    Car.findById(req.params.id).populate('category'),
    Category.find().sort({ name: 1 }),
  ]);
  res.render('updateCar_get', { title: 'Update Car', car, categoriesList });
});
