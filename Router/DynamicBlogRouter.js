const express = require('express');
const router= express.Router()
const DynamicBlogController = require('../Controller/DynamicBlogController.js');
router.get('/', DynamicBlogController.getdynamicblog);

router.post('/add', DynamicBlogController.addDynamicBlog);
router.put('/update/:id', DynamicBlogController.updatedynamicblog);
router.delete('/delete/:id', DynamicBlogController.deletedynamicblog);
module.exports=router