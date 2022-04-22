if(process.env.NODE_ENV!=='production')
{
    require('dotenv').config()
}

const express = require('express')
const mongo_sanitize=require('express-mongo-sanitize')
const path = require('path')
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const flash=require('connect-flash');
const ejsMate = require('ejs-mate')
const ExpressError=require('./utils/ExpressErrors')
const res = require('express/lib/response');
const req=require('express/lib/request');
const session=require('express-session')
const passport=require('passport')
const user=require('./models/user')
const localStrategy=require('passport-local')

 const db_url=process.env.DB_URL||'mongodb://localhost:27017/yelp-camp'
mongoose.connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error!!!'));
db.once("open", () => {
    console.log("Database connected");
});
const secret=process.env.SECRET||'thisshouldbeabettersecret'
const MongoDBStore=new require('connect-mongo')
const app = express()
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.json());
app.use(express.urlencoded());
app.use(mongo_sanitize())
const store=new MongoDBStore({
    mongoUrl:db_url,
    secret,
    touchAfter:24*60*60
})
store.on('error',function(e){
    console.log('SESSION STORE ERROR',e)
})
const sessionConfig={
    store,
    name:'session',
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        // secure:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(user.authenticate()))
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())
app.use((req,res,next)=>{
    
    res.locals.currentUser=req.user
    res.locals.success=req.flash('success')
    res.locals.error=req.flash('error')
    next()
})
const campgrounds=require('./routes/campgrounds')
const review=require('./routes/reviews')
const users=require('./routes/users')
app.use('/campgrounds',campgrounds)
app.use('/campgrounds/:id/reviews',review)
app.use('/',users)
app.use(express.static(path.join(__dirname,'public')))
app.get('/',(req,res)=>{
    res.render('home')
})

// validateReview,
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})
app.use((err, req, res, next) => {
    const { statuscode = 500 } = err
    if (!err.message) err.message = 'Oh No, Something Went Wrong!!'
    res.status(statuscode).render('error', { err })
})
app.listen(3000, (req, res) => {
    console.log('Listening to port 3000')
})





