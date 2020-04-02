const express = require('express');
const router = express.Router()
const postControllers=require('../controllers/post')
const authcheck=require('../middleware/auth-check')
const fileData=require('../middleware/file')

//End Point for create a Post
router.post('',authcheck,fileData,postControllers.createPost)
//End Point for get all Post
router.get('',postControllers.getAllPost)
//get by id
router.get('/:id',postControllers.getSinglePost)
//delete
router.delete('/:id', authcheck,postControllers.deleteAPost)

router.put("/:id",authcheck,fileData, postControllers.updateAPost);
module.exports = router;
