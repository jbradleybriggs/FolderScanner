
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
    constructor() {
        this.fs = require('fs');
        if (process.platform == "win32") this.slash = "\\";
        else this.slash = '/';
    }

    scanSync(folderPath, filter = [], recursive = true) {
        fileList = [];
        if (!filter || (typeof filter == 'object' && filter.length == 0)) filter = ['.*'];
        if (!folderPath) folderPath = process.argv[1].slice(0, process.argv[1].lastIndexOf(this.slash));
        var files = this.fs.readdirSync(folderPath, { withFileTypes: true });
        var getAll = filter.includes(".*");

        if (files.length > 0) {
            for (var index in files) {
                var path = folderPath + this.slash + files[index].name;

                if (files[index].isDirectory() && recursive) {
                    var innerFs = new FolderScanner(path, filter);
                    var innerFiles = innerFs.getFiles(recursive); //recursively scan 
                    fileList = fileList.concat(innerFiles); //append these
                }
                else if (files[index].isFile()) {

                    if (!getAll) {
                        var ext = path.substring(path.lastIndexOf(".")).toLowerCase();
                        if (filter.includes(ext)) {
                            fileList.push(path);
                        }
                    }
                    else fileList.push(path);
                }
            }
        }
        return fileList;
    }

    async readdir(path) {
        return new Promise((resolve, reject) => {
            this.fs.readdir(path, { withFileTypes: true }, (err, files) => {
                if (err) resolve([]); //don't reject - merely resolve with nothing
                resolve(files);
            })
        });
    }

    async __scan(path, filter, recursive) {
        // console.log(path, filter);
        var fileList = [];
        var files = await this.readdir(path);
        var getAll = filter.includes(".*");;

        if (files.length > 0) {
            for (var index in files) {
                var subPath = path + this.slash + files[index].name;
                if (files[index].isDirectory() && recursive) {
                    var subFileList = await this.__scan(subPath, filter, recursive);
                    fileList = fileList.concat(subFileList); //append these
                }
                else if (files[index].isFile()) {
                    if (!getAll) {
                        var ext = subPath.substring(subPath.lastIndexOf(".")).toLowerCase();
                        if (filter.includes(ext)) {
                            fileList.push(subPath);
                        }
                    }
                    else fileList.push(subPath);
                }
            }
        }
        return fileList;
    }

    async scan(folderPath, filter = [], recursive = true) {
        if (!filter || (typeof filter == 'object' && filter.length == 0)) filter = ['.*'];
        if (!folderPath) folderPath = process.argv[1].slice(0, process.argv[1].lastIndexOf(this.slash));
        //console.log(folderPath, filter);
        return new Promise((resolve, reject) => {
            resolve(this.__scan(folderPath, filter, recursive));
        })
    }
}

var fscan = new FolderScanner();
fscan.scan("/home/jason/Downloads", ['.txt', '.jpg']).then((val) => {
    console.log(val);
})