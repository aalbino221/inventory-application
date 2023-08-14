const Car = require('../model/car');
const Category = require('../model/category');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.index = asyncHandler(async (req, res, next) => {
  const cars = await Car.find().sort({ added: -1 }).limit(4);
  res.render('index', { title: 'DriveCar', cars });
});

exports.car_detail = asyncHandler(async (req, res, next) => {
  const car = await Car.findById(req.params.id).populate('category');
  res.render('car_details', { title: car.name, car });
});

exports.browse = asyncHandler(async (req, res, next) => {
  const carList = await Car.find().populate('category');
  res.render('browse', { title: 'Browse', carList });
});

exports.browse_categories = asyncHandler(async (req, res, next) => {
  const carList = await Car.find().populate('category');
  const sortedCarList = carList.sort((a, b) =>
    a.category.name.localeCompare(b.category.name),
  );
  res.render('browse', { title: 'Browse', carList: sortedCarList });
});

exports.browse_year = asyncHandler(async (req, res, next) => {
  const carList = await Car.find().populate('category').sort({ year: 1 });
  res.render('browse', { title: 'Browse', carList });
});

exports.newCar_get = asyncHandler(async (req, res, next) => {
  const categoriesList = await Category.find().sort({ name: 1 });
  res.render('newCar_get', { title: 'New Car', categoriesList });
});

exports.newCar_post = [
  body('name').trim().isLength({ min: 1 }).escape(),
  body('description').trim().isLength({ min: 1, max: 500 }).escape(),
  body('category').trim().isLength({ min: 1, max: 500 }).escape(),
  body('year').trim().isLength({ min: 1 }).escape(),
  body('price').trim().isLength({ min: 1 }).escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const car = new Car({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      year: req.body.year,
      price: req.body.price,
      imgUrl: req.body.imgUrl,
      added: new Date(),
    });
    if (!errors.isEmpty()) {
      console.log(errors);
      res.render('newCar_get', { title: 'New Car', car });
      return;
    }
    await car.save();
    await Category.findOneAndUpdate(
      {
        _id: car.category,
      },
      { $inc: { count: 1 } },
    );
    res.redirect(car.url);
  }),
];

exports.updateCar_get = asyncHandler(async (req, res, next) => {
  const [car, categoriesList] = await Promise.all([
    Car.findById(req.params.id).populate('category'),
    Category.find().sort({ name: 1 }),
  ]);
  res.render('updateCar_get', { title: 'Update Car', car, categoriesList });
});

exports.updateCar_post = [
  body('name').trim().isLength({ min: 1 }).escape(),
  body('description').trim().isLength({ min: 1, max: 500 }).escape(),
  body('category').trim().isLength({ min: 1, max: 500 }).escape(),
  body('year').trim().isLength({ min: 1 }).escape(),
  body('price').trim().isLength({ min: 1 }).escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const car = new Car({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      year: req.body.year,
      price: req.body.price,
      imgUrl: req.body.imgUrl,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      const categoriesList = await Category.find().sort({ name: 1 });
      res.render('updateCar_get', { title: 'Update Car', car, categoriesList });
    }

    const updatedCar = await Car.findByIdAndUpdate(req.params.id, car, {});

    const [catOld, catNew] = await Promise.all([
      Car.find({ category: updatedCar.category }).countDocuments(),
      Car.find({ category: req.body.category }).countDocuments(),
    ]);

    await Promise.all([
      Category.findByIdAndUpdate(updatedCar.category, { count: catOld }),
      Category.findByIdAndUpdate(req.body.category, { count: catNew }),
    ]);

    res.redirect(updatedCar.url);
  }),
];

exports.deleteCar_get = asyncHandler(async (req, res, next) => {
  const car = await Car.findById(req.params.id);
  res.render('deleteCar', { title: 'Delete Car', car });
});

exports.deleteCar_post = asyncHandler(async (req, res, next) => {
  const car = await Car.findByIdAndRemove(req.params.id);
  await Category.findOneAndUpdate(
    {
      _id: car.category,
    },
    { $inc: { count: -1 } },
  );
  res.redirect('/browse');
});
