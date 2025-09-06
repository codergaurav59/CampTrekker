const mongoose=require('mongoose');
const cities=require('./cities')
const {descriptors,places}=require('./seedHelpers');


const Campground=require('../models/campgrounds');

mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://rezulbansal2018:Rezul1828@cluster1.tbqnyoj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1')
.then(()=>{
    console.log('We are connected!!');
})
.catch(err=>{
    console.log("We got an error",err);
})
const makeName=(arr)=>{
    const num=Math.floor(Math.random()*arr.length);
    return arr[num];
}

const seedDB=async()=>{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const random1000=Math.floor(Math.random()*1000)
        const location=`${cities[random1000].city} ${cities[random1000].state}` ;
        const newCamp=new Campground({location:location,title:`${makeName(descriptors)} ${makeName(places)}`,
    image:"https://images.unsplash.com/photo-1466873767530-f11ce2656cff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODQzNTF8fHx8fHx8MTY4NDU4Mjc2Nw&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
description:"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero doloribus sequi officiis ducimus velit similique itaque! Officia assumenda repellat cum quod, illum esse consequatur expedita, alias porro autem earum dolorem!"});
    await newCamp.save();
    }
    
}
seedDB().then(()=>{
    mongoose.connection.close();
});
