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

router.get('/browse/categories', carController.browse_categories);

router.get('/browse/year', carController.browse_year);

router.get('/new/car', carController.newCar_get);

router.post('/new/car', carController.newCar_post);

router.get('/new/category', categoriesController.newCategory_get);

router.post('/new/category', categoriesController.newCategory_post);

router.get('/cars/update/:id', carController.updateCar_get);

router.post('/cars/update/:id', carController.updateCar_post);

router.get('/cars/remove/:id', carController.deleteCar_get);

router.post('/cars/remove/:id', carController.deleteCar_post);

router.get('/categories/update/:id', categoriesController.updateCategory_get);

router.post('/categories/update/:id', categoriesController.updateCategory_post);

router.get('/categories/remove/:id', categoriesController.deleteCategory);

router.post('/categories/remove/:id', categoriesController.deleteCategory_post);

module.exports = router;
