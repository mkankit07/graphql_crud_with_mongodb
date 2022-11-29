const e = require('express')
const mongose = require('mongoose')
const Schema = mongose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
   email : {
        type: String,
        required: true
    },
    createdEvent:[{
        type: Schema.Types.ObjectId,
        ref:'Event',
    }]
})

module.exports=mongose.model('User',userSchema)