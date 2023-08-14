const Category = require('../model/category');
const Car = require('../model/car');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

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

exports.updateCategory_post = [
  body('name').trim().isLength({ min: 1 }).escape(),
  body('description').trim().isLength({ min: 1 }).escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      res.render('updateCategory_get', { title: 'Update Category', category });
      return;
    }
    const categoryExists = await Category.findOne({
      name: req.body.name,
    }).collation({ locale: 'en', strength: 2 });
    if (categoryExists && categoryExists._id != req.params.id) {
      res.redirect(categoryExists.url);
      return;
    }
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      category,
      {},
    );
    res.redirect(updatedCategory.url);
  }),
];

exports.newCategory_post = [
  body('name').trim().isLength({ min: 1 }).escape(),
  body('description').trim().isLength({ min: 1 }).escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      count: 0,
    });
    if (!errors.isEmpty()) {
      res.render('newCategory_get', { title: 'New Category', category });
      return;
    }
    const categoryExists = await Category.findOne({
      name: req.body.name,
    }).collation({ locale: 'en', strength: 2 });
    if (categoryExists) {
      res.redirect(categoryExists.url);
      return;
    }
    await category.save();
    console.log('New category saved');
    res.redirect('/categories');
  }),
];

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const carList = await Car.find({ category: req.params.id });
  res.render('deleteCategory', {
    title: 'Delete Category',
    carList,
    category: req.params.id,
  });
});

exports.deleteCategory_post = asyncHandler(async (req, res, next) => {
  await Category.findByIdAndRemove(req.params.id);
  res.redirect('/categories');
});
