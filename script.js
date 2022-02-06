const fs = require("fs");
const path = require("path");

const loc = "../avi-dev/python/bin/portal/static/src"
//const loc = './src';

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
  //fs.close(dirPath); 
  return arrayOfFiles;
}

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
    //fs.close(writeFile);
  });
  //fs.close(fileDir);
}

const arrayOfFiles = getAllFiles(loc,[]);

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

appendData();

console.log("Filter successful");

const appendObjData = (data) => {
  fs.appendFile('./result.ts', data, err => {
    if(err){
        console.error(err);
        return;
    }
  });
  console.log("Data Appended");
  //fs.close('./result.ts');
}

const wordFreq = (str) =>{
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
    for(let i in found){
      let val = `${i} : ${found[i]} \n`;
      console.log(typeof(val));
      appendObjData(val)
    }
    return found;
}

const readCommonFile = (fileDir) => {
  fs.readFile(fileDir, 'utf8' , (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    wordFreq(data);
  });
  //fs.close(fileDir);
}

readCommonFile('./common.l10n.ts');
console.log("end!!!");  