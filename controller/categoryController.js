const Category = require('../model/category');
const Car = require('../model/car');
const asyncHandler = require('express-async-handler');

exports.categories_get = asyncHandler(async (req, res, next) => {
  const categoriesList = await Category.find();
  res.render('categories', {
    title: 'Categories',
    categoriesList,
  });
});

exports.categories_detail = asyncHandler(async (req, res, next) => {
  const [info, carList] = await Promise.all([
    Category.findById(req.params.id),
    Car.find({ category: req.params.id }).populate('category'),
  ]);
  res.render('categories_details', { title: `${info.name}`, info, carList });
});

exports.newCategory_get = asyncHandler(async (req, res, next) => {
  res.render('newCategory_get', { title: 'New Category' });
});

exports.updateCategory_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  res.render('updateCategory_get', { title: 'Update Category', category });
});
