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


function getArgs() {
    let args = process.argv.slice(2);

    return args;
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
    const fetch = require('node-fetch');

    fetch(urlObj.href).then( response => {
        urlObj.ok = response.ok;
        urlObj.status = response.status;
    }).catch( error => {
        urlObj.ok = false;
        urlObj.status = -1; //means link is broken
    });

}



function getLinksFromMd(path){

    //let args = getArgs();
    //let path = args[0]; 
    //let validateOption = true;

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


    // if (validateOption ) {
    //     urlList.forEach(urlObj => {
    //         validateUrl(urlObj);

    //     });
    // }
    
    return urlList;
}


function mdLinks(path, options) {
    let linksObjs = new Promise(function(resolve, reject){
        let links = getLinksFromMd(path);

        if (links.length === 0) {
            reject("Invalid path or File");
        }
        resolve(links);
    });

    if (options && options.validate) {
        linksObjs.then( function (links) {
            links.forEach( function (link) {
               validateUrl(link); 
            });
        }

        );
    }

    return linksObjs;
}


mdLinks("./README.md", {validate:true}).then( links => links.forEach( link => {console.log(link);} )).catch(err => console.log(err));
//console.log(main(getArgs()[2]));

// console.log(getMdFiles(""));
// console.log(getMdFiles("..\\README.md"));
// console.log(getMdFiles("."));
// console.log(getMdFiles(".."));
// console.log(getMdFiles("./mdLinks.js"));
// console.log(getMdFiles("C:\\Users\\rouge\\Documents\\Monse\\Laboratoria\\GDL002-md-links"));


module.exports = getMdFiles;