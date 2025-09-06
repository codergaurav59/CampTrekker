
const express=require('express');
const router=express.Router({mergeParams:true});
const Joi=require('joi');
const catchAsync=require('../utils/catchAsync');
const {addReview,deleteReview}=require('../controllers/reviews');
const ExpressError=require('../utils/ExpressError');
const Campground=require('../models/campgrounds')
const Review=require('../models/reviews')
const {isReviewAuthor,validateReview}=require('../middleware');

// const validateReview=(req,res,next)=>{
//     const reviewSchema=Joi.object({
//         review:Joi.object({
//             body:Joi.string().required(),
//         rating:Joi.number().required()

//         })
        
        
//     })
//     const {error}=reviewSchema.validate(req.body);
//     if(error){
//         console.log(error);
//         // const msg=error.details.map(el=>el.message).join(',')
        
//         throw new ExpressError(error,400)
        
//     }
//     else{
//         next();
//     }
// }


router.delete("/:reviewId",catchAsync(async(req,res)=>{
    // res.send("Delete route");
    const {id,reviewId}=req.params;
    
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success',"Successfully deleted Review")
    res.redirect(`/campgrounds/${id}`);
}))

router.post('/',validateReview,catchAsync(async (req,res)=>{
    const camp=await Campground.findById(req.params.id);
    const review=new Review(req.body.review);
    review.author=req.user._id;
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success',"Successfully added Review")
    res.redirect(`/campgrounds/${req.params.id}`)
}))
module.exports=router