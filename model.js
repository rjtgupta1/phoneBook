const mongoose = require('mongoose')
const contactSchema = mongoose.Schema({
    firstName:{
        type:String,
        require:true,
        minLength:3,
    },
    secondName:{
        type:String,
        require:true,
        minLength:3,
    },
    phone:{
        type:Number,
        require:true,
        minLength:10,
        maxLength:10,
        unique:true
    }
},
{
    versionKey:false
})

const contact = mongoose.model('contact',contactSchema)
module.exports = contact
