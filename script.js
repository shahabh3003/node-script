const fs = require("fs");
const path = require("path");

const loc = "../avi-dev/python/bin/portal/static/src"
//const loc = './src';

// iterates through the projects and gives the file path of each file in arrayOfFiles(array)
const getAllFiles = (dirPath, arrayOfFiles) => {
  //console.log("dirPath");
  files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || []
  files.forEach((file) => {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(__dirname, dirPath, "/", file));
    }
  })
   
  return arrayOfFiles;
}

// reads the data of each location and writes to common.l10n.ts, filters out the unnecessary part
const getData = (fileDir, writeFile) => {
  fs.readFile(fileDir, 'utf8' , (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    let content = data;
    content = content.replaceAll("*",'');
    content = content.replaceAll("/",'');
    content = content.replaceAll("-",'');
    content = content.replaceAll("Copyright 2021 VMware, Inc.  All rights reserved. VMware Confidential",'');
    content = content.replaceAll("Copyright 2020 VMware, Inc.  All rights reserved. VMware Confidential",'');
    content = content.replaceAll("@module");
    content = content.trim();
    content = content.replaceAll("@export",'');
    fs.appendFile(writeFile, content, err => {
      if(err){
          console.error(err);
          return;
      }
    });
  });
  
}

// iterates through arrayOfFiles and recursively calls getData function
const appendData = () => {
  for(let i=0;i<arrayOfFiles.length;i++){
    const regex = ".l10n.";
    const match = arrayOfFiles[i].includes(regex);
    if(match){
      console.log(match, " : ", arrayOfFiles[i]);
      getData(arrayOfFiles[i], './common.l10n.ts');
    }
  }
  console.log("Successfull");
}

// writes the word frequency to result.ts, called recursively by wordFreq
const appendObjData = (data) => {
  fs.appendFile('./result.ts', data, err => {
    if(err){
      console.error(err);
      return;
    }
  });
  console.log("Data Appended");
  
}

// creates the word frequency and writes to result.ts recursively
const wordFreq = (str) =>{
  console.log("wordFreq", str);
  let words = str.split(' ');
  let found = {};

  words.map(( word ) => {
    if ( word.length >= 1 ) {
      if ( found[word] ) {
        found[word]++;
      }else{
        found[word] = 1;
      }
    }
  });
  console.log("wordFreq", found);
  for(let i in found){
    let val = `${i} : ${found[i]} \n`;
    console.log(typeof(val));
    appendObjData(val)
  }
  return found;
}

// reads common.l10n.ts and creates the word frequency
const readCommonFile = (fileDir) => {
  console.log("reading common file");
  fs.readFile(fileDir, 'utf8' , (err, data) => {
    if (err) {
      console.error(err)
      return
    }

    console.log("reading common file", data);
    wordFreq(data);
  });
  
}

const arrayOfFiles = getAllFiles(loc,[]);
appendData();
console.log("Filter successful");
readCommonFile('./common.l10n.ts');
console.log("end!!!");  