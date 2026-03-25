import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
    originalUrl:{
        type: String,
        required: true,
        unique: true
    },
    shortId:{
        type: String,
        required: true,
        unique: true,
    },
    visitCount:{
        type: Number,
        default: 0
    }
},{
    timestamps: true
})

export const UrlModel = mongoose.model('Url', urlSchema)