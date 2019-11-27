const { connectDB } = require('./connect-db')
const mongoose = require('mongoose');
const urlsModel = mongoose.model('Urls')

// function to add or update url in db
const addOrUpdateUrl = async element=>{
    await connectDB();
    let query = { url: element.url };
    let update = { $inc:{referenceCount:1}, $addToSet: {parameters:{$each: element.parameters || [] }} };
    let options = {upsert:true};
    try {
        await urlsModel.findOneAndUpdate(query,update,options)
    } catch (error) {
        console.log(error)
        // handling duplicate key error as findOneAndUpdate is not really atomic.
        if( error.code==11000 ){
            await urlsModel.findOneAndUpdate(query,update,options)
        }
    }
};

// function to fetch results from database
const fetchResults = async element=>{
    await connectDB();
    try {
        const results = await urlsModel.find({})
        return results
    } catch (error) {
        console.log(error)
    }
};

// function that extracts url and params from url and updates to db
const saveToDB = async (urlArray)=>{
    await connectDB();
    let objArray = []
    urlArray.forEach(element => {
        let object = {parameters:[]}
        let parts = element.split("?")
        object.url = parts[0]
        if(parts.length>1){
            object.parameters = parts[1].split("&")
            .map(el=>{
                return el.split('=')[0];
            })
            .filter(el=>el!=null)
        }
        objArray.push(object)
    })

    objArray.forEach(async element => {
        addOrUpdateUrl(element)
    });

}

module.exports= {
    addOrUpdateUrl,
    saveToDB,
    fetchResults
}