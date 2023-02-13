const https = require('https');
const JSSoup = require('jssoup').default;
const fs = require('fs');
const url = "https://en.wikipedia.org/wiki/Giant_panda"; // FIRST: find a url of a page you are interested in from wikipedia 
const jsonPath = "./json/"; 
const name = "";


function getParagraphText(soupTag){
    let paragraphs = soupTag.findAll('p');
    let text = '';
    for(let i = 0; i < paragraphs.length; i++){
        let p = paragraphs[i].getText().toLowerCase();

    if(p.indexOf("panda") != -1){
    console.log(p);
    text += p;
    }

    }
    console.log(soupTag);
    return text;
}

function writeJSON(data){
    try {
        let path = jsonPath+name+".json";
        fs.writeFileSync(path, JSON.stringify(data, null, 2), "utf8");
        console.log("JSON file successfully saved");
    } catch (error) {
        console.log("An error has occurred ", error);
    }
}

function createSoup(document){
    
    let soup = new JSSoup(document);
    let data = {
        "name": name,
        "url": url,
        "content": {}
        
    }; 

    let main = soup.find('main');

    data.content = {
        "text": getParagraphText(main)
    };
        
    //output json
    writeJSON(data);

    function jjj(main){
        createSoup(main);
    }

}

https.get(url, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);
    
    let document = [];

    res.on('data', (chunk) => {
        document.push(chunk);
    }).on('end', () => {
        document = Buffer.concat(document).toString();
        // console.log(body);
        createSoup(document);
    });

}).on('error', (e) => {
    console.error(e);
});



function getAllExternalLinks(soup){
    let aTags = soup.findAll('a'); // return an array of SoupTag object
    let links = [];//收集所有符合条件的链接
   
    for(let i = 0; i < aTags.length; i++){
        let attrs = aTags[i].attrs;// get a tag attributes  含有条件的element

        if('href' in attrs){
            let hrefValue = attrs.href;
        }
        links.push(hrefValue);
    }
    return links;
}