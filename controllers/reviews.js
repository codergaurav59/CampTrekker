const Campground=require('../models/campgrounds')
const Review=require('../models/reviews')


module.exports.addReview= async (req,res)=>{
    const camp=await Campground.findById(req.params.id);
    const review=new Review(req.body.review);
    review.author=req.user._id;
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success',"Successfully added Review")
    res.redirect(`/campgrounds/${req.params.id}`)
}
module.exports.deleteReview= async(req,res)=>{
    // res.send("Delete route");
    const {id,reviewId}=req.params;
    
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success',"Successfully deleted Review")
    res.redirect(`/campgrounds/${id}`);
}