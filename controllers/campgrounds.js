const Campground=require('../models/campgrounds')
const {cloudinary}=require('../cloudinary/index')
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index= async(req,res)=>{
    const campgrounds=await Campground.find({});
    res.render('Campgrounds/index',{campgrounds});
}
module.exports.renderNewForm=(req,res)=>{
    res.render('Campgrounds/new');
}


module.exports.getCampground=async(req,res,next)=>{
    const campground=await Campground.findById(req.params.id).populate({path:'reviews',populate:{path:'author'}}).populate('author');
    console.log(campground);
    const reviews=await Campground.findById(req.params.id).reviews;
    if(!campground){
        req.flash('error',"Cannot find that campground");
        return res.redirect('/campgrounds')
    }
res.render('Campgrounds/show',{campground,reviews});
}


module.exports.createNewCampground=async (req,res,next)=>{
    const campground= new Campground(req.body.campground);
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    // console.log(geoData.body.features);
    // res.send("data received")
    // console.log(req.user);
    campground.author=req.user._id;

    campground.images=req.files.map(f=>({url:f.path,name:f.filename}));
    campground.geometry=geoData.body.features[0].geometry;
    // console.log(campground);
    await campground.save();
    req.flash('success','successfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`)
}
module.exports.getEditForm=async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error',"Cannot find that campground");
        return res.redirect('/campgrounds')
    }
    if(!campground.author.equals(req.user._id)){
        req.flash('error',"You are not allowed to edit this campground");
        return res.redirect(`/campgrounds/${campground._id}`);
    }
    
    return res.render('Campgrounds/edit',{campground});
   
}



module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    // console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.name }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let name of req.body.deleteImages) {
            await cloudinary.uploader.destroy(name);
        }
        await campground.updateOne({ $pull: { images: { name: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}


module.exports.deleteCampground=async (req,res)=>{
    const {id}=req.params;
   const campToBeDeleted= Campground.findById(id);
   const imgsDel=campToBeDeleted.images;
   console.log(imgsDel);
   for(image of imgsDel){
    console.log(image);
    await cloudinary.uploader.destroy(image);
   }
    await Campground.findByIdAndDelete(id);
    req.flash('success',"Successfully deleted Campground")
    res.redirect('/campgrounds');

}

// module.exports.updateCampground=async (req,res,next)=>{
    
//     const {id}=req.params;
    
//     // const campground=await Campground.findByIdAndUpdate(id,{...req.body.campground})
//     // const campground=await Campground.findById(id);
    
//     // if(!campground){
//     //     req.flash('error','This campground does not exist');
//     //     return res.redirect('/campgrounds');

//     // }
//     // if(!campground.author.equals(req.user._id)){
//     //             req.flash('error',"You are not allowed to edit this campground");
//     //             return res.redirect(`/campgrounds/${campground._id}`);
//     //         }
//     console.log(req.body.deleteImages);
    
    
//     const campground=await Campground.findByIdAndUpdate(id,{...req.body.campground});
//     const imgs=req.files.map(f=>({url:f.path,name:f.filename}));
//     campground.images.push(...imgs);
//     await campground.save();
//     if(req.body.deleteImages){
//         for(let name of req.body.deleteImages){
//             cloudinary.uploader.destroy(name);
//         }
//         // await Campground.updateOne({$pull:{images:{name:{$in:req.body.deleteImages}}}});
//         await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
//         console.log(campground);

//     }
//     req.flash('success',"Successfully updated Campground")
//     return res.redirect(`/campgrounds/${campground._id}`);
    

// }