const { isValidUrl,recursiveState } = require('../lib/utility');
const {fetchResults} = require('../db/communicate-db');

var http = require('https');
// var agent = new http.Agent({maxSockets: 5});

const options = {
  host: process.env.CRAWLURL || 'https://medium.com'
};

const recursiveCrawl = app => {


    // api route to start the crawling process
    app.get("/crawl",async(req,res)=>{
        let recursiveStateObj = new recursiveState()
        try{
            // recursiveStateObj.recursiveCrawl([options.host])
            recursiveStateObj.start(options.host)
            res.send(`<h1>Crawling Started</h1><br><br><a href='/get'>Fetch Results</a>`)
        }catch(e){
            console.log("error",e)
            res.send(`Some error occurred`)
        }
    })

    // api route to get the results
    app.get("/get",async(req,res)=>{
        try{
            let arr = await fetchResults()
            res.json(arr)
        }catch(e){
            console.log("error",e)
            res.send(`Some error occurred`)
        }
    })

};

module.exports = { recursiveCrawl };