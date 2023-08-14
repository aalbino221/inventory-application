var express = require('express');
var router = express.Router();
const carController = require('../controller/carController');
const categoriesController = require('../controller/categoryController');

/* GET home page. */
router.get('/', carController.index);

router.get('/categories', categoriesController.categories_get);

router.get('/categories/:id', categoriesController.categories_detail);

router.get('/cars/:id', carController.car_detail);

router.get('/browse', carController.browse);

router.get('/new/car', carController.newCar_get);

router.get('/new/category', categoriesController.newCategory_get);

router.get('/cars/update/:id', carController.updateCar_get);

router.get('/categories/update/:id', categoriesController.updateCategory_get);

module.exports = router;
