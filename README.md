# FolderScanner
Recursively scan the contents of a folder based on certain file types.

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
