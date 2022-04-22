const express=require('express')
const router=express.Router({mergeParams:true})
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressErrors');
const Review=require('../models/review')
const Campground = require('../models/campground');
const reviews=require('../controllers/reviews')
const { campgroundSchema,reviewSchema } = require('../schemas.js');
const {validateReview,isLoggedin,isReviewAuthor}=require('../middleware')
router.post('/',isLoggedin,validateReview, catchAsync(reviews.createReview))
router.delete('/:reviewId',isLoggedin,isReviewAuthor,catchAsync(reviews.deleteReview))
module.exports=router