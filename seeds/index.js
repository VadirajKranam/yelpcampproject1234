const mongoose = require('mongoose');
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
// const campground = require('../models/campground');
const Campground = require('../models/campground')
mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error!!!'));
db.once("open", () => {
    console.log("Database connected");
});
const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price=Math.floor(Math.random()*30)
        const camp = new Campground({
            author:"625a69c09639c19c8cf9e21d",
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)},${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam vel sapiente minus, consequuntur temporibus excepturi minima. Omnis, doloribus minus voluptatum porro voluptates quos fugiat dolor, possimus expedita suscipit tenetur blanditiis!',
            price:price,
            images:[
                {
                  url: 'https://res.cloudinary.com/dloqleovf/image/upload/v1650193535/YelpCamp/hzxwnqt209mpccklv9er.jpg',
                  filename: 'YelpCamp/hzxwnqt209mpccklv9er',
                  
                }
              ],
              geometry:{
                  type:"Point",
                  coordinates:[
                      cities[random1000].longitude,
                      cities[random1000].latitude
                    ]
              }
        })
        await camp.save()
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})