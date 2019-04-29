//"use strict";
const fs = require("fs");


/**
 * Returns an array of mdFiles path from a path string
 * @param {string} path 
 * @returns {Array} 
 */
function getMdFiles(path) {
    let mdFiles = [];
    
    if (fs.existsSync(path)) {
        let stat = fs.statSync(path);
 
        if (stat.isFile() && path.endsWith(".md")) {
            mdFiles.push(path);
        }
        else if(stat.isDirectory()) {

            let dirPath = path;
            let files = fs.readdirSync(dirPath);

            for (let index = 0; index < files.length; index++) {
                const filepath = dirPath + "/" + files[index];
                let fstat = fs.statSync(filepath);

                if (fstat.isFile() && filepath.endsWith(".md")) {
                    mdFiles.push(filepath);    
                }
            }
        }
    }

    return mdFiles;
}

/**
 * Reads a markdown string an returns a list of
 * Url objets  
 * @param {string} text
 * @param {string} file -- path of file
 * @returns List of Objects {href, text, file}
*/
function getUrls(text, file) {

    // TODO: explan regex: http://blog.michaelperrin.fr/2019/02/04/advanced-regular-expressions/
    const linkRegex = /\[(?<text>.+)\]\((?<url>[^ ]+)(?: "(?<title>.+)")?\)/g;
    let result;
    let urlList = [];

    while ( (result = linkRegex.exec(text)) !== null )  {
        let urlObj = {
            href: result.groups.url,
            text: result.groups.text, 
            file:file 
        };

        urlList.push(urlObj);
    }

    return urlList;
}


function validateUrl(urlObj) {
    const request = require('sync-request');

    try {
        let res = request("GET", urlObj.href);
        urlObj.status = res.statusCode;
        
        //https://es.wikipedia.org/wiki/Anexo:C%C3%B3digos_de_estado_HTTP
        urlObj.ok = res.statusCode <400; 

    } catch (error) {
        urlObj.ok = false;
        urlObj.status = -1; // means link does not exist
    }

}



function getLinksFromMd(path){

    let filesPaths = getMdFiles(path);

    let urlList = [];
    for (let index = 0; index < filesPaths.length; index++) {
        let onePath = filesPaths[index];
        let data = fs.readFileSync(onePath, 'utf8');

        let lines = data.split("\n");

        for (let index = 0; index < lines.length; index++) {
            const line = lines[index];
            let urlObjs = getUrls(line, onePath);
            urlList.push(...urlObjs);
        }

    }

    
    return urlList;
}


function mdLinks(path, options) {
    let linksObjs = new Promise(function(resolve, reject){
        let links = getLinksFromMd(path);

        if (links.length === 0) {
            reject("Invalid path or File");
        }

        if (options && options.validate === true) {
            links.forEach(function (link) {
                validateUrl(link);
            });
        }

        resolve(links);
    });

    return linksObjs;
}


//mdLinks("../test/md_files_test/test.md", {validate:true}).then( links => links.forEach( link => {console.log(link);} )).catch(err => console.log(err));


module.exports = {
    getMdFiles: getMdFiles, 
    getUrls: getUrls,
    mdLinks: mdLinks
};

function main() {
    const commandLineArgs = require('command-line-args');

    const optionDefinitions = [
        {name: "validate", type: Boolean},
        {name: "stats", type:Boolean},
        {name: "path", type:String, defaultOption: true}
    ];

    const args = commandLineArgs(optionDefinitions);
    
    const path = args.path;
    
    const options = {
        validate: args.validate === true,
        stats: args.stats === true
    };

    mdLinks(path, options).then(urls =>{
        if (options.stats === false) {
            // print each url object
            urls.forEach(url =>{
                let strOk;
                if (options.validate === true) {
                    strOk = url.ok === true ? "ok" : "fail";
                }
                else{
                    strOk = "";
                }
                let urlInfo =   url.file + "\t" +
                                url.href + "\t" +
                                url.text + "\t" + 
                                strOk + "\t" +
                                (url.status||"");
                console.log(urlInfo);
            });
        }
        else{
            console.log("Total: ", urls.length);
            console.log("Uniques: ", [...new Set(urls.map(url=>url.href))].length);

            if (options.validate === true) {
                let brokenLinks = 0;
                for (let index = 0; index < urls.length; index++) {
                    const url = urls[index];
                    brokenLinks += url.ok === false?1:0;
                }

                console.log("Broken: ", brokenLinks);
            }

        }

    }).catch( error => {
        console.log(error);
    });

}

main();