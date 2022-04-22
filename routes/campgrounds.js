const express=require('express')
const router=express.Router()
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressErrors');
const {isLoggedin,isAuthor,validateCampground}=require('../middleware')
const { campgroundSchema,reviewSchema } = require('../schemas.js');
const flash=require('connect-flash');
const review=require('../models/review');
const campgrounds=require('../controllers/campgrounds')
const multer=require('multer')
const {storage}=require('../cloudinary')
const upload=multer({storage})
router.route('/')
            .get(catchAsync(campgrounds.index))
            .post(isLoggedin, upload.array('image'),validateCampground, catchAsync(campgrounds.createCampground))
// .post(upload.array('image'),(req,res)=>{
   
//    res.send("It worked")
// })
router.get('/new', isLoggedin,campgrounds.renderNewForm)

router.route('/:id')    
            .get(catchAsync(campgrounds.showCampground))  
            .put(isLoggedin,isAuthor, upload.array('image'),validateCampground, catchAsync(campgrounds.updateCampground))  
            .delete(isLoggedin,isAuthor, catchAsync(campgrounds.deleteCampground))    

router.get('/:id/edit',isLoggedin,isAuthor,catchAsync(campgrounds.renderEdit))


module.exports=router