const Review=require('../models/review')
const Campground = require('../models/campground');
module.exports.createReview=async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    const review1=new Review(req.body.review);
    review1.author=req.user._id
    campground.reviews.push(review1);
    await review1.save()
    await campground.save()
    // res.statusCode=200
    // res.status(200).send("Done");
    req.flash('success','Successfully created new review')
    res.redirect(`/campgrounds/${campground._id}`)
}
module.exports.deleteReview=async(req,res)=>{
    const {id,reviewId}=req.params
    const deleted=await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(req.params.reviewId)
    req.flash('success','Successfully deleted review')
    res.redirect(`/campgrounds/${id}`)
}