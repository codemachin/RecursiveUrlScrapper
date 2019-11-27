const cheerio = require('cheerio')
const request = require('request')
const { saveToDB } = require('../db/communicate-db')

// regex function to check valid url
const isValidUrl = (string) => {
  const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(string);
}

const options = {
  host: process.env.CRAWLURL || 'https://medium.com'
};

// function to scrape urls by a tags
const scrape = (req) => {
    return new Promise((resolve, reject) => {
        let urls = [];
        // req.host = req.host.replace(/(^\w+:|^)\/\//, '');
        // var request = http.get(req, function(resp) {
        //     var bodyChunks = [];
        //     resp.on('data', function(chunk) {
        //         bodyChunks.push(chunk);
        //     }).on('end', function() {
        //         var body = Buffer.concat(bodyChunks);
        //         if (body) {
        //             $ = cheerio.load(body);
        //             links = $('a');
        //             $(links).each(function (i, link) {
        //                 const url = $(link).attr('href')
        //                 let match = options.host.replace(/(^\w+:|^)\/\//, '')
        //                 if(url && url.includes(match))
        //                     if(isValidUrl(url))
        //                         taskUrls.push(url);
        //             });
        //             taskUrls=[...new Set(taskUrls)]
        //             resolve(taskUrls)
        //         } else {
        //             resolve(taskUrls)
        //         }
        //     })
        // });

        // request.on('error', function(e) {
        //     // console.log('ERROR: ' + e.message);
        //     resolve([])
        // });

        request(req.host, (err, res, body) => {
            if (err) {
                console.log(err)
                resolve([]);
            }
            if (body) {
                $ = cheerio.load(body);
                links = $('a');
                $(links).each(function (i, link) {
                    const url = $(link).attr('href')
                    if(url && url.includes(options.host))
                        if(isValidUrl(url))
                            urls.push(url);
                });
                urls=[...new Set(urls)]
                resolve(urls)
            } else {
                resolve(urls)
            }
        })
    })
}

// Class function with states and methods
function recursiveState(){
    this.allUrls = []
    this.count = 5
    this.counter = 0
    
    // method used for recursively crawl given array and save to db
    this.recursiveCrawl = async(urls) => {
        while (this.counter < count) {
            this.counter++
            for(let url of urls){
                let option = { host: url }
                let newUrls = await scrape(option)
                let filteredNewUrls = newUrls.filter(e => !this.allUrls.includes(e))
                // console.log("urls",filteredNewUrls)
                if(filteredNewUrls.length){
                    this.allUrls = [...this.allUrls,...filteredNewUrls]
                    saveToDB(filteredNewUrls)
                    this.recursiveCrawl(filteredNewUrls)
                }
                this.counter--
            }
        }
        this.recursiveCrawl(urls)
    }

    // gets url in current state
    this.get = () => {
        return this.allUrls
    }

}

module.exports = {isValidUrl,scrape,recursiveState}
