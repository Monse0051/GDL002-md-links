const { getMdFiles, getUrls} = require('../src/mdLinks');


// run tests with
// npm test -- --collectCoverage


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
    expect(getUrls('./README.md')).toEqual([]);
  });

});