const mdLink = require('../src/mdLinks');
const getMdFiles = mdLink.getMdFiles;
const getUrls = mdLink.getUrls;
const validateUrl = mdLink.validateUrl;
const getLinksFromMd = mdLink.getLinksFromMd;
const mdLinks = mdLink.mdLinks;
// run tests with
// npm test -- --collectCoverage

// FIXME: when npm test command is executed with  arguments, it fails, e.g.
// UNKNOWN_OPTION: Unknown option: --coverage
// workaround: comment out main() in mdlinks.js

// test is executed from repo root directory
// i.e jest CWD (current working directory) = <path to>/GDL002-md-links/

describe('testing function getMdFiles', () => {

  test('getMdFiles shall be a function', () => {
    expect(typeof getMdFiles).toBe('function');
  });

  test('If parameter of getMdFiles is not a valid path, it shall return and empty array', ()=>{
    expect(getMdFiles("")).toEqual([]);
  });

  
  test('If parameter of getMdFiles is a valid path inside of the actuall directory and it have an file .md, it shall return and array whit the path of this file', ()=>{
    expect(getMdFiles('.')).toEqual(['./README.md']);
  });

  test('...', ()=>{
    expect(getMdFiles('./test/md_files_test')).toEqual(['./test/md_files_test/test.md']);
  });

  test('...', ()=>{
    expect(getMdFiles('./test/md_files_test/test.md')).toEqual(['./test/md_files_test/test.md']);
  });
 
});

describe('testing function getUrls', () => {

  test('getUrl shall be a function', () => {
    expect(typeof getUrls).toBe('function');
  });

  test('If the parameter of getUrls is tex and the file, it shall return a List of url objects', ()=>{
    expect(getUrls("[ejemplo](example.com)","test.md")).toEqual([{
           "file": "test.md",
           "href": "example.com",  
           "text": "ejemplo"}]);
  });

});

describe('testing function validateUrls', ()=>{

  test('validateUrl shall be a function', () => {
    expect(typeof validateUrl).toBe('function');
  });

  test('validateUrl modifies input paramenter ..', ()=> {
    let urlObj = {
      href: "http://www.example.com",
      text: "example",
      file: "dummy.md"
    };
    validateUrl(urlObj);
    expect(urlObj).toEqual({
      href: "http://www.example.com",
      text: "example",
      file: "dummy.md",
      status: 200,
      ok: true
    });
  });

  test('validateUrl modifies input paramenter ..', ()=> {
    let urlObj = {
      href: "http://www.awsxd.com",
      text: "example",
      file: "dummy.md"
    };
    validateUrl(urlObj);
    expect(urlObj).toEqual({
      href: "http://www.awsxd.com",
      text: "example",
      file: "dummy.md",
      status: -1,
      ok: false
    });
  });

});

describe('testing function getLinksFromMd', ()=>{

  test('getLinksFromMd shall be a function', () => {
    expect(typeof getLinksFromMd).toBe('function');
  });
  test('If the parameter of getLinksFromMd is path, it shall return a List of url objects', ()=>{
    expect(getLinksFromMd('./test/md_files_test/test.md')).toEqual([{"file": "./test/md_files_test/test.md", 
    "href": "http://www.example.com", 
    "text": "text: example"}, 
    {"file": "./test/md_files_test/test.md", 
    "href": "http://www.example.co", 
    "text": "text: does not work"}, 
    {"file": "./test/md_files_test/test.md", 
    "href": "http://www.example.com/hola_mundo", 
    "text": "text: ejemplo de 404"}, 
    {"file": "./test/md_files_test/test.md", 
    "href": "http://www.example.com", 
    "text": "text: example"}]);
  });
});  

describe('testing function mdLinks', ()=>{

  test('mdLinks shall be a function', () => {
    expect(typeof mdLinks).toBe('function');
  });

  test('mdLinks shall be returns a promise', () => {
    expect(mdLinks("../test/md_files_test/test.md", {validate:true})).toEqual(new Promise(function(resolve, reject){}))
  });

  test('mdLinks shall be returns an error if path or file are incorrect ', () => {
    return expect(mdLinks("./README", {validate:true})).rejects.toMatch("Invalid path or File");
  });
}); 