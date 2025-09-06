const indiaCities=[
    {
      "name": "Kanpur",
      "latitude": 26.4499,
      "longitude": 80.3319
    },
    {
      "name": "Visakhapatnam",
      "latitude": 17.6868,
      "longitude": 83.2185
    },
    {
      "name": "Nagpur",
      "latitude": 21.1458,
      "longitude": 79.0882
    },
    {
      "name": "Indore",
      "latitude": 22.7196,
      "longitude": 75.8577
    },
    {
      "name": "Coimbatore",
      "latitude": 11.0168,
      "longitude": 76.9558
    },
    {
      "name": "Patna",
      "latitude": 25.5941,
      "longitude": 85.1376
    },
    {
      "name": "Vadodara",
      "latitude": 22.3072,
      "longitude": 73.1812
    },
    {
      "name": "Bhubaneswar",
      "latitude": 20.2961,
      "longitude": 85.8245
    },
    {
      "name": "Thiruvananthapuram",
      "latitude": 8.5241,
      "longitude": 76.9366
    },
    {
      "name": "Guwahati",
      "latitude": 26.1445,
      "longitude": 91.7362
    },
    {
      "name": "Mangalore",
      "latitude": 12.9141,
      "longitude": 74.8560
    },
    {
      "name": "Raipur",
      "latitude": 21.2514,
      "longitude": 81.6296
    },
    {
      "name": "Ranchi",
      "latitude": 23.3441,
      "longitude": 85.3096
    },
    {
      "name": "Amravati",
      "latitude": 20.9374,
      "longitude": 77.7796
    },
    {
      "name": "Jodhpur",
      "latitude": 26.2389,
      "longitude": 73.0243
    },
    {
      "name": "Dehradun",
      "latitude": 30.3165,
      "longitude": 78.0322
    },
    {
      "name": "Srinagar",
      "latitude": 34.0837,
      "longitude": 74.7973
    },
    {
      "name": "Kozhikode",
      "latitude": 11.2588,
      "longitude": 75.7804
    },
    {
      "name": "Jamshedpur",
      "latitude": 22.8046,
      "longitude": 86.2029
    },
    {
      "name": "Allahabad",
      "latitude": 25.4358,
      "longitude": 81.8463
    },
    {
        "name": "Jaipur",
        "latitude": 26.9124,
        "longitude": 75.7873
      },
      {
        "name": "Lucknow",
        "latitude": 26.8467,
        "longitude": 80.9462
      },
      {
        "name": "Chandigarh",
        "latitude": 30.7333,
        "longitude": 76.7794
      },
      {
        "name": "Agra",
        "latitude": 27.1767,
        "longitude": 78.0081
      }
  ]
  
descriptors = [
    'Forest',
    'Ancient',
    'Petrified',
    'Roaring',
    'Cascade',
    'Tumbling',
    'Silent',
    'Redwood',
    'Bullfrog',
    'Maple',
    'Misty',
    'Elk',
    'Grizzly',
    'Ocean',
    'Sea',
    'Sky',
    'Dusty',
    'Diamond'
]

places = [
    'Flats',
    'Village',
    'Canyon',
    'Pond',
    'Group Camp',
    'Horse Camp',
    'Ghost Town',
    'Camp',
    'Dispersed Camp',
    'Backcountry',
    'River',
    'Creek',
    'Creekside',
    'Bay',
    'Spring',
    'Bayshore',
    'Sands',
    'Mule Camp',
    'Hunting Camp',
    'Cliffs',
    'Hollow'
]

const mongoose=require('mongoose');
const Campground=require('../models/campgrounds')
const cities=require('./cities');
// const {descriptors,places}=require('./seedHelpers');
// console.log(descriptors);
const dbUrl="mongodb+srv://rezulbansal2018:Rezul1828@cluster1.tbqnyoj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";
// 'mongodb://localhost:27017/yelp-camp2'
mongoose.connect(dbUrl,
{
    useNewUrlParser:true,
    // useCreateIndex:true, 
    useUnifiedTopology:true
}
)
const db=mongoose.connection;
db.on("error",console.error.bind(console,"connectioon error:"));
db.once("open",()=>{
    console.log("Database connected");
});
const sample=array=> {
    const num=Math.floor(Math.random()*array.length);
    return array[num];
}
const makeName=(arr)=>{
    const num=Math.floor(Math.random()*arr.length);
    return arr[num];
}

const seedDb=async ()=>{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const random1000=Math.floor(Math.random()*1000);
        const random20=Math.floor(Math.random()*20);
        const calcPrice=Math.floor(Math.random()*20)+10;
        const newCamp=new Campground({location:`${indiaCities[random20].name}`,
        title:`${makeName(descriptors)} ${makeName(places)}`,
        author:"6484228b1ce86223ac5d7285",
        price:calcPrice,
        geometry: { type: 'Point', 
        // coordinates: [cities[random1000].longitude,cities[random1000].latitude]
        coordinates: [indiaCities[random20].longitude,indiaCities[random20].latitude]
     },
        images: [
            {
              url: 'https://res.cloudinary.com/dwjlajbov/image/upload/v1747770144/Screenshot_2025-02-07_010210_ezeiv7.png',
              name: 'rezul-yelp/Screenshot_2025-02-07_010210_ezeiv7',
              
            },
            {
              url:'https://res.cloudinary.com/dwjlajbov/image/upload/v1747770144/Screenshot_2025-02-07_010210_ezeiv7.png' ,
              name: 'rezul-yelp/Screenshot_2025-02-07_010210_ezeiv7',

             
            }
          ],
        
description:"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero doloribus sequi officiis ducimus velit similique itaque! Officia assumenda repellat cum quod, illum esse consequatur expedita, alias porro autem earum dolorem!"
    });
        await newCamp.save();

        

    }
    
    
    
    
}
seedDb().then(()=>{
    mongoose.connection.close();
})