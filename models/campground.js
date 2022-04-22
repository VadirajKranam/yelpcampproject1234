const mongoose=require('mongoose');
const Review=require('./review')

const ImageSchema=new mongoose.Schema({
    
        url:String,
        filename:String 
})
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_300')
})
const opts={toJSON:{virtuals:true}}
const campGroundSchema=new mongoose.Schema({
    title:String,
    images:[ImageSchema],
    geometry:{
      type:{
          type:String,
          enum:['Point'],
          required:true
      },
      coordinates:{
          type:[Number],
          required:true
      }
    },
    price:Number,
    description:String,
    location:String,
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
  
},opts);
campGroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0,20)}...</p>`
})
campGroundSchema.post('findOneAndDelete',async function(doc){
     if(doc){
         await Review.deleteMany({
             _id:{
                  $in:doc.reviews
             }
         })
     }
})
module.exports=mongoose.model('Campgrounds',campGroundSchema);
