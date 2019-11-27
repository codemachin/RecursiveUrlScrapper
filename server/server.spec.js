const { addOrUpdateUrl } = require('./db/communicate-db');

(async function(){
    await addOrUpdateUrl({url:"http://test.url",parameters:["test1","test2"]});
    console.info("Added url object");
})();