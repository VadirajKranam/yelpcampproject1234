const Campground = require('../models/campground');

const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken=process.env.MAPBOX_TOKEN
const geoCoder=mbxGeocoding({accessToken:mapBoxToken})
const {cloudinary}=require('../cloudinary')
module.exports.index=async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}
module.exports.renderNewForm=(req, res) => {
    res.render('campgrounds/new')
}
module.exports.createCampground=async(req, res, next) => {
    // if (!req.body.campground) {
    //     throw new ExpressError('invalid campground data', 400);
    // }
   const geoData=await geoCoder.forwardGeocode({
       query:req.body.campground.location,
       limit:1
   }).send()
   
   const newCampground = new Campground(req.body.campground);
   newCampground.geometry=geoData.body.features[0].geometry
    newCampground.images= req.files.map(f=>({url:f.path,filename:f.filename}))
    newCampground.author=req.user._id
    await newCampground.save();
    console.log(newCampground)
    req.flash('success','Susccesfully created new campground')
    res.redirect(`/campgrounds/${newCampground._id}`)
}
module.exports.showCampground=async(req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author')
    if(!campground){
        req.flash('error','Cannot find campground!');
        return res.redirect('/campgrounds')
    }
    else{
    res.render('campgrounds/show', { campground })
    }
}
module.exports.renderEdit=async(req, res) => {
    const {id}=req.params
    const campground = await Campground.findById(id)
    if(!campground){
        req.flash('error','Cannot find campground!');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit',{campground})
}
module.exports.updateCampground=async(req, res) => {
    const { id } = req.params
   const campground= await Campground.findByIdAndUpdate(id,{...req.body.campground }, { new: true })
  if (!campground.author.equals(req.user._id)){
      req.flash('error','You dont have permission to do that')
      return res.redirect(`/campgrounds/${id}`)
  }
   const imgs= req.files.map(f=>({url:f.path,filename:f.filename}))
   campground.images.push(...imgs)
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
     await campground.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
    }
    const geoData=await geoCoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send()
    campground.geometry=geoData.body.features[0].geometry
    await campground.save()
    req.flash('success','successfully updated campground')
    res.redirect(`/campgrounds/${campground._id}`)
}
module.exports.deleteCampground=async(req, res) => {
    const { id } = req.params
   
    await Campground.findByIdAndDelete(id)
    req.flash('success','Successfully deleted campground')
    res.redirect('/campgrounds')
}