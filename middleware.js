const Review=require('./models/reviews')
const Campground=require('./models/campgrounds')
const ExpressError = require('./utils/ExpressError');
const { campgroundSchema, reviewSchema } = require('./schemas.js');

module.exports.isLoggedIn=(req,res,next)=>{
    
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl; 
        req.flash('error',"You must be signed in");
        return res.redirect('/login');
    }
    next();

} 
module.exports.isReviewAuthor=(req,res,next)=>{
    const {id,reviewId}=req.params;
    const review=Review.findById(reviewId);
    // console.log(review);
    const camp=Campground.findById(id);
    
    // console.log(review);
    if(!review.author.equals(req.user._id)){
        req.flash('error',"You can't delete this review");
        res.redirect(`campgrounds/${camp._id}`);

    }
    next();

} 
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}
module.exports.validateCampground=(req,res,next)=>{
    const {error}=campgroundSchema.validate(req.body);
    if(error){
        // console.log(error);
        // const msg=error.details.map(el=>el.message).join(',')
        
        throw new ExpressError(error,400)
        
    }
    else{
        next();
    }
    
}
module.exports.validateReview=(req,res,next)=>{
    // const reviewSchema=Joi.object({
    //     review:Joi.object({
    //         body:Joi.string().required(),
    //     rating:Joi.number().required()

    //     })
        
        
    // })
    const {error}=reviewSchema.validate(req.body);
    if(error){
        // console.log(error);
        // const msg=error.details.map(el=>el.message).join(',')
        
        throw new ExpressError(error,400)
        
    }
    else{
        next();
    }
}