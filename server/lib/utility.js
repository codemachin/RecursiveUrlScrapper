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

// Class function with states and methods
function recursiveState(){
    // array to keep all urls used by the recursive scrape method
    this.allUrls = []
    this.count = 5
    this.counter = 0

    // recursive function to scrape urls by A tags
    this.scrape = () => {
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
                    $(links).each(function (i, link) {
                        const url = $(link).attr('href')
                        if(url && url.includes(options.host))
                            if(isValidUrl(url))
                                urls.push(url);
                    });
                    // remove duplicates
                    urls=[...new Set(urls)]
                    // filter urls not present in this.allUrls
                    let filteredNewUrls = urls.filter(e => !this.allUrls.includes(e))
                    // add to array for scraping
                    this.allUrls = [...this.allUrls,...filteredNewUrls]
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
        this.allUrls.push(url)
        this.scrape()
    }

    // gets url in current state
    this.get = () => {
        return this.allUrls
    }

}

module.exports = {isValidUrl,recursiveState}
