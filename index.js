const express = require('express')
const mongoose = require('mongoose')
const contact = require('./model')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')

const app = express()

// setting view engine
app.set('view engine','ejs')

// using assets
app.use('/css',express.static(path.resolve(__dirname,'/assets/css')))
app.use('/img',express.static(path.resolve(__dirname,'/assets/img')))
app.use('/js',express.static(path.resolve(__dirname,'/assets/js')))


app.use(bodyParser.urlencoded({extended:true}))
app.use('/public',express.static('public'))
mongoose.set('strictQuery', false)
const url = "mongodb://127.0.0.1:27017/phoneBook"
try{
    mongoose.connect(url)
    console.log('Connected to dataBase')
}catch(err){
    console.log(err)
}
app.get('/add',(req,res)=>{
    res.render('add')
})
let dt = ''
const fun = async()=>{
    dt = await contact.find()
}
try {
    fun()
} catch (error) {
    console.log(error);
}

app.get('/',async(req,res)=>{
    await res.render('home',{users:dt})
})
app.get('/edit',async (req,res)=>{
    const response = await contact.find({_id: req.query.id});
    res.render('update', {data: response})
})
app.post('/update',async(req,res)=>{
    const firstName = await req.body.name1
    const secondName = await req.body.name2
    const phone = await req.body.phone
    if(firstName!='' || secondName!='' || phone!=''){
    const updated_data = await contact.updateOne(
        {_id:req.query.id},
        {$set:{
            firstName:firstName,
            secondName:secondName,
            phone:phone
        }}
    ).then((x)=>{
        fun()
        res.redirect('/')
    })
    }
    else{
        var html = fs.readFileSync(__dirname+"/views/add.ejs")
        res.write(html)
        res.write("<h2><center>All fields are mandetory!</center></h2>")
        res.send()
    }
})
app.get('/delete',async(req,res)=>{
    await contact.deleteOne({_id:req.query.id})
    .then((x)=>{
        fun()
        res.redirect('/')
    })
})
let status = 'false'
app.post('/',(req,res)=>{
    const firstName = req.body.name1
    const secondName = req.body.name2
    const phone = req.body.phone
    if(firstName!='' || secondName!='' || phone!=''){
        const contactInfo = contact({
            firstName:firstName,
            secondName:secondName,
            phone:phone
        })
        try{
            contactInfo.save()
            console.log('Contact Saved')
            status = 'true'
            if(status){
                var html = fs.readFileSync(__dirname+"/views/add.ejs")
                res.write(html)
                res.write("<h2><center>Contact Saved<center></h2>")
                fun()
            }
        }catch(err){
            if(err){
                console.log(err)
            }
        }
    }
    else{
        var html = fs.readFileSync(__dirname+"/views/add.ejs")
        res.write(html)
        res.write("<h2><center>All fields are mandetory!</center></h2>")
    }
    res.send()
})

const PORT = process.env.PORT || 3000
app.listen(PORT,(err)=>{
    if(err){
        console.log(err)
    }else{
        console.log(`Server is running on port ${PORT}`)
    }
})