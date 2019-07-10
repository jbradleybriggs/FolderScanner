# FolderScanner
Scan the contents of a folder, filtering on certain file types. The scan can be done both asynchronously and synchronously; 
the asynchronous version is recommended since recursively reading the contents of a folder and all its sub folders etc. can
cause a major code block if done synchronously.

# Installation
Install the module with: `npm install @drama_llama/folderscanner --save`


# Useage
```js
  const FolderScanner = require('FolderScanner');
  var fscan = new FolderScanner() ;
  
  // Asynchronously scan the downloads folder for JPEG and PNG files:
  fscan.scan("/home/username/Downloads", ['.jpg', 'jpeg', '.png'])
       .then((list) => {
          // do something with list
          console.log(list) ; 
        }) ;
  
  // Synchronously scan Program Files for EXE files:
  var list = fscan.scanSync("C:\\Program Files", ['.exe']) ;
  // do something with the list
  console.log(list) ;
  
  //Asynchronously scan for all file types in the Downloads folder but without recursing:
  fscan.scan("/home/username/Downloads", [], false)
       .then((list) => {
          //do something with list
          console.log(list) ; 
        }) ;
```

