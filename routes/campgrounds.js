const express=require('express');
const router=express.Router();
const Joi=require('joi');
const catchAsync=require('../utils/catchAsync');
const ExpressError=require('../utils/ExpressError');
const multer  = require('multer')
const {storage}=require('../cloudinary');
const upload = multer({ storage });
const Campground=require('../models/campgrounds')
const Campgrounds=require('../controllers/campgrounds')
const Review=require('../models/reviews')
const {isLoggedIn,validateCampground}=require('../middleware');
const {storeReturnTo}=require('../middleware');
const campgrounds = require('../models/campgrounds');

// const validateCampground=(req,res,next)=>{
//     const campgroundSchema=Joi.object({
//         campground:Joi.object({
//             title: Joi.string().required(),
//         price: Joi.number().required().min(0),
        
//         description: Joi.string().required(),
//         location: Joi.string().required(),

//         }).required(),
//         deleteImages:Joi.array()
        
//     })
//     const {error}=campgroundSchema.validate(req.body);
//     if(error){
//         // console.log(error);
//         // const msg=error.details.map(el=>el.message).join(',')
        
//         throw new ExpressError(error,400)
        
//     }
//     else{
//         next();
//     }
    
// }
router.get('/',Campgrounds.index);

router.get('/new',isLoggedIn,Campgrounds.renderNewForm)

router.get('/:id',catchAsync(Campgrounds.getCampground))

// router.post('/',isLoggedIn,validateCampground, catchAsync(Campgrounds.createNewCampground))
router.post('/',upload.array('image'),validateCampground,catchAsync(Campgrounds.createNewCampground))
// router.post('/',upload.single('image'),(req,res)=>{
//     console.log(req.body,req.file);
//     res.send("It worked!!");
// })

router.get('/:id/edit',isLoggedIn,Campgrounds.getEditForm)

router.put('/:id',isLoggedIn, upload.array('image'),validateCampground, catchAsync(Campgrounds.updateCampground))

router.delete('/:id',isLoggedIn,Campgrounds.deleteCampground)
module.exports=router;


// const isAuthor=async (req,res,next)=>{
//     const {id}=req.params;
    
//     const campground=await Campground.findById(id);
//     // console.log(campground);
//     if(!campground.author.equals(req.user._id)){
//         req.flash('error',"You are not allowed to edit this campground");
//         return res.redirect(`/campgrounds/${campground._id}`);
//     }
//     next();
// }