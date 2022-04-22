const express=require('express')
const { path } = require('express/lib/application')
const morgan=require('morgan')
const app=express()
const AppError=require('./AppError')

app.use(morgan('dev'))
// app.use((req,res,next)=>{
//     console.log("THIS IS MY FIRST MIDDLE WARE")
//   next()

// })
// app.use((req,res,next)=>{
//     console.log("THIS IS MY SECONDT MIDDLE WARE")
//     next()
// })
app.use((req,res,next)=>{
    req.requestTime=Date.now()
    console.log(req.method,req.path)
    next()
})
app.use('/dogs',(req,res,next)=>{
    console.log("I LOVE DOGS")
    next()
})
// app.use((req,res,next)=>{
//     const {password}=req.query
//     if(password==='dosa'){
//         next()
//     }
//     else{
//         res.send('SORRY YOU NEED A PASSWORD')
//     }
// })
app.get('/',(req,res)=>{
    console.log(`REQUEST DATE: ${req.requestTime}`)
    res.send('Home page')
})
const verifyPassword=(req,res,next)=>{
    const {password}=req.query
    if(password==='friend')
    {
         next()
    }
    // else{
    //     res.send('INCORRECT PASSWORD TRY AGAIN')
    // }
  
    throw new AppError('PASSWORD REQUIRED',401)
}
app.get('/dogs',verifyPassword,(req,res)=>{
    console.log(`REQUEST DATE: ${req.requestTime}`)
    res.send('WOOF WOOF')
})
app.get('/error',(req,res)=>{
   chcieken.fly()
})
// app.use('/secret',(req,res,next)=>{
    // const {password}=req.query
    // if(password==='friend')
    // {
    //      next()
    // }
    // else{
    //     res.send('INCORRECT PASSWORD TRY AGAIN')
    // }
// })

app.get('/secret',verifyPassword,(req,res)=>{
    res.send("SOME TIMES I WEAR HEADPHONES IN PUBLIC SO I DONT HAVE TO TALK TO ANYONE")
})
app.get('/admin',(req,res)=>{
    throw new AppError('YOU ARE NOT AN ADMIN',403)
})
app.use((req,res)=>{
    res.status(404).send('not found')
})

app.use((err,req,res,next)=>{
    const {status=500}=err
    const {message='Something went wrong'}=err
    res.status(status).send(message)
})
app.listen(3000,()=>{
    console.log('APP IS RUNNING ON LOCALHOST 3000')
})