const getMdLinks = require('../src/mdLinks');


// run tests with
// npm test -- --collectCoverage


// test is executed from repo root directory
// i.e jest CWD (current working directory) = <path to>/GDL002-md-links/

describe('testing function getMdLinks', () => {

  test('getMdLinks shall be a function', () => {
    expect(typeof getMdLinks).toBe('function');
  });

  test('If parameter of getMdLinks is not a valid path, it shall return and empty array', ()=>{
    expect(getMdLinks("")).toEqual([]);
  });

  
  test('If parameter of getMdLinks is a valid path inside of the actuall directory and it have an file .md, it shall return and array whit the path of this file', ()=>{
    expect(getMdLinks('.')).toEqual(['./README.md']);
  });

  test('...', ()=>{
    expect(getMdLinks('./test/md_files_test')).toEqual(['./test/md_files_test/test.md']);
  });

  test('...', ()=>{
    expect(getMdLinks('./test/md_files_test/test.md')).toEqual(['./test/md_files_test/test.md']);
  });


  
});
