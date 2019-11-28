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

// this function convert all url keys to have same value
// example input: http://xyz.com?a=23&b=52
//example output: http://xyz.com?a=101&b=101
const setSameValues = (string) => {
    var url = new URL(string);
    var query_string = url.search;
    var search_params = new URLSearchParams(query_string); 
    for(var key of search_params.keys()) { 
        search_params.set(key, '101');
    }
    url.search = search_params.toString();
    var new_url = url.toString();
    return new_url
}

// Class function with states and methods
function recursiveState(){
    //added map for better performance
    this.m = new Map()

    // array to keep all urls used by the recursive scrape method
    // this.globalUrlArray = []
    this.allUrls = []
    this.count = 5
    this.counter = 0

    // recursive function to scrape urls by A tags
    this.scrape = () => {
    console.log("here")
        while (this.allUrls.length && this.counter < this.count) {
            let urls = [];
            let run = this.allUrls.shift()
            this.counter++
            request(run, (err, res, body) => {
                if (err) {
                    this.counter--
                    this.scrape()
                }
                if (body) {
                    $ = cheerio.load(body);
                    links = $('a');
                    // iterate and push ony urls with different keys, disregarding values
                    $(links).each(function (i, link) {
                        const url = $(link).attr('href')
                        if(url && url.includes(options.host))
                            if(isValidUrl(url))
                                urls.push(setSameValues(url));
                    });
                    // remove duplicates
                    urls=[...new Set(urls)]
    
                    // filter urls not present in this.globalUrlArray
                    // let filteredNewUrls = urls.filter(e => !this.globalUrlArray.includes(e))

                    // Map will have better performance over array
                    let filteredNewUrls = urls.filter(e => !this.m.has(e))
                    // add to array for scraping
                    this.allUrls = [...this.allUrls,...filteredNewUrls]
                    // this.globalUrlArray = [...this.globalUrlArray,...filteredNewUrls]
                    filteredNewUrls.reduce((a,b)=> (a.set(b,true),a),this.m);
                    saveToDB(filteredNewUrls)
                    this.counter--
                    this.scrape()
                } else {
                    this.counter--
                    this.scrape()
                }
            })
        }
    }

    // function to start the scraping process
    this.start = (url) => {
        // this.globalUrlArray.push(url)
        this.m.set(url,true)
        this.allUrls.push(url)
        this.scrape()
    }

    // gets url in current state
    this.get = () => {
        return this.allUrls
    }

}

module.exports = {isValidUrl,recursiveState}
