const catchAsync=require('../utils/catchAsync');
const ExpressError=require('../utils/ExpressError');
const User=require('../models/user')
module.exports.getRegisterUserPage= (req,res)=>{
    res.render('User/register');
}
module.exports.getLoginUserPage= (req,res)=>{
    res.render('User/login');
}
module.exports.logoutUser=(req,res,next)=>{
    
        req.logout(function (err) {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Goodbye!');
            // console.log("Initiating a logout");
            res.redirect('/campgrounds');
        });
    }

module.exports.registerNewUser=catchAsync(async(req,res)=>{
    // res.send(req.body);
    try{
    const {username,email,password}=req.body;
    const user=new User({username,email});
    const regUser=await User.register(user,password);
    req.login(regUser,err=>{
        if(err) return next(err)
        // console.log(regUser);
        req.flash('success',"welcome to Campify");
         res.redirect('/campgrounds');
        
    })
    
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('register');
    }
})
module.exports.returnPage=async (req,res)=>{
    // const user=await User.findOne({username:req.body.username});
    // console.log(user);
    const redirectUrl = res.locals.returnTo || '/campgrounds'
    req.flash('success',"Logged in successfully Good Job!")
   res.redirect(redirectUrl);
  
    
  }
