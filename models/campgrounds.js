const mongoose = require("mongoose");
const reviews = require("./reviews");
const Schema = mongoose.Schema;
const opts={toJSON:{virtuals:true}};
const ImageSchema=new Schema({
  url:String,
      name:String

})
ImageSchema.virtual('thumbnail').get(function(){
  return this.url.replace('/upload','/upload/w_200');
});
const CampgroundSchema = new Schema({
  title: String,
  geometry:{
    type:{
      type:String,
      enum:["Point"],
      required:true
    },
    coordinates:{
      type:[Number],
      required:true
    }
  },
  images: [ImageSchema],
  price: Number,
  description: String,
  location: String,
  author:{
    type:Schema.Types.ObjectId,
    ref:"User"
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
},opts);

CampgroundSchema.virtual('properties.popupText').get(function(){
  return `<strong><a href='/campgrounds/${this._id}'>${this.title}</a></strong>
  <p>${this.description.substring(0,20)}...</p>`
});

CampgroundSchema.post('findOneAndDelete',async(doc)=>{
    // console.log(doc);
    if(doc){
        await reviews.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
})
module.exports = mongoose.model("Campground", CampgroundSchema);
