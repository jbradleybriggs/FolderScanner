
/**
*
* @author J. Bradley Briggs
*/
/*module.exports = */class FolderScanner {
    /**
     * 
     * @param {string} folderPath 
     * @param {Array} filter array of strings, always lower case
     */
    constructor(folderPath, filter) {
        this.fs = require('fs');
        this.folderPath = folderPath;
        this.filter = filter;
        if (process.platform == "win32") this.slash = "\\";
        else this.slash = '/';
    }

    getFilesSync(recursive) {
        this.fileList = [];
        var files = this.fs.readdirSync(this.folderPath, { withFileTypes: true });
        var getAll = this.filter.includes(".*");

        if (files.length > 0) {
            for (var index in files) {
                var path = this.folderPath + this.slash + files[index].name;

                if (files[index].isDirectory() && recursive) {
                    var innerFs = new FolderScanner(path, this.filter);
                    var innerFiles = innerFs.getFiles(recursive); //recursively scan 
                    this.fileList = this.fileList.concat(innerFiles); //append these
                }
                else if (files[index].isFile()) {

                    if (!getAll) {
                        var ext = path.substring(path.lastIndexOf(".")).toLowerCase();
                        if (this.filter.includes(ext)) {
                            this.fileList.push(path);
                        }
                    }
                    else this.fileList.push(path);
                }
            }
        }
        return this.fileList;
    }

    async getFiles(recursive) {
        return new Promise((resolve, reject) => {
            this.fileList = [];
            var files = this.fs.readdir(this.folderPath, { withFileTypes: true }, (err, files) => {
                if (err) reject(err);
                else {
                    var getAll = this.filter.includes(".*");

                    if (files.length > 0) {
                        for (var index in files) {
                            var path = this.folderPath + this.slash + files[index].name;
                            //console.log(path) ;

                            if (files[index].isDirectory() && recursive) {
                                var innerFs = new FolderScanner(path, this.filter);
                                console.log(path);
                                innerFs.getFiles(recursive).then((data) => {
                                    this.fileList = this.fileList.concat(data); //append these
                                });
                                //this.fileList.concat(innerFs.getFilesSync(true)) ;
                            }
                            else if (files[index].isFile()) {
                                if (!getAll) {
                                    var ext = path.substring(path.lastIndexOf(".")).toLowerCase();
                                    if (this.filter.includes(ext)) {
                                        this.fileList.push(path);
                                    }
                                }
                                else this.fileList.push(path);
                            }
                        }
                        resolve(this.fileList);
                    }
                }
                // console.log(this.fileList) ;
                resolve(this.fileList);
            });
        });
    }

    saveToFile(filePath) {
        if (this.fs.exists(filePath)) {
            this.fs.unlink(filePath, (err) => { if (err) throw err });
        }
        this.fs.appendFile(filePath, this.fileList);
    }
}

var fscan = new FolderScanner("/home/jason/Videos", [".mp4", ".mkv", ".avi", ".flv", ".mpg", ".rm", ".webm"]);
fscan.getFiles(true).then((list) => {
    console.log("THE LIST" + list);
});