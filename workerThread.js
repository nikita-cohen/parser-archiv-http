const {workerData} = require("worker_threads");
const axios = require('axios')
const cheerio = require('cheerio');

async function parseData(url) {

   const {data} = await axios.get(url);
   const obj = {};
   const $ = cheerio.load(data);
   const datatwo = $("div.C234 > div.collection-title.C.C2");

   const firstHref = [];

   for (let i =0; i < datatwo.length; i++) {
      firstHref.push({href : $(datatwo[i]).children("a").attr('href'), text : $(datatwo[i]).children("a").text().replace(/[^a-zA-Z0-9 ]/g, '').trim()});
   }

   for (let i = 0; i < firstHref.length; i++) {
      let isResult = true;
      let count = 1;
      obj.brand = firstHref[i].text;
      obj.category = firstHref[i].text;
      while (isResult) {
         const data2 = await axios.get("https://archive.org/" + firstHref[i].href + "?&sort=titleSorter&page=" + count.toString());

         const newSelector = cheerio.load(data2.data)

         const datato = newSelector(`div.C234 > div.item-ttl.C.C2`);

         const lastElement = [];

         for (let j =0; j < datato.length; j++) {
            lastElement.push({href : newSelector(datato[j]).children("a").attr('href'), text : newSelector(datato[j]).children("a").attr('title')});
         }



         if (lastElement.length > 0) {
            lastElement.forEach((manual, index) => {

               obj.url = "https://archive.org" + manual.href;
               obj.title = manual.text;

               axios.post("https://search.findmanual.guru/manual/search/insert/", obj)
                   .then(data => console.log("ok ", index))
                   .catch((e) => console.log(e))
            })
            count++;
         } else {
            isResult = false;
         }
      }
   }


}

parseData(workerData.url).then();
