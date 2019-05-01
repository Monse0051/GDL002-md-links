#! /usr/bin/env node
const mdLinks = require('./src/mdLinks.js').mdLinks;

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