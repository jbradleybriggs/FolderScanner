
/**
*
* @author J. Bradley Briggs
*/
module.exports = class FolderScanner {
    /**
     * 
     * @param {string} folderPath 
     * @param {Array} filter array of strings, always lower case
     */
    constructor(folderPath, filter) {
        this.fs = require('fs');
        this.folderPath = folderPath;
        if (!filter || (typeof filter == 'object' && filter.length == 0)) filter = ['.*'];
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

    async readdir(path) {
        return new Promise((resolve, reject) => {
            this.fs.readdir(path, { withFileTypes: true }, (err, files) => {
                if (err) resolve([]); //don't reject - merely resolve with nothing
                resolve(files);
            })
        });
    }

    async __getFiles(path, recursive) {
        var fileList = [];
        var files = await this.readdir(path);
        var getAll = this.filter.includes(".*");;

        if (files.length > 0) {
            for (var index in files) {
                var subPath = path + this.slash + files[index].name;
                if (files[index].isDirectory() && recursive) {
                    var subFileList = await this.__getFiles(subPath, recursive);
                    fileList = fileList.concat(subFileList); //append these
                }
                else if (files[index].isFile()) {
                    if (!getAll) {
                        var ext = subPath.substring(subPath.lastIndexOf(".")).toLowerCase();
                        if (this.filter.includes(ext)) {
                            fileList.push(subPath);
                        }
                    }
                    else fileList.push(subPath);
                }
            }
        }
        return fileList;
    }

    async getFiles(recursive) {
        return new Promise((resolve, reject) => {
            resolve(this.__getFiles(this.folderPath, recursive));
        })
    }

    saveToFile(filePath) {
        if (this.fs.exists(filePath)) {
            this.fs.unlink(filePath, (err) => { if (err) throw err });
        }
        this.fs.appendFile(filePath, this.fileList);
    }
}

// var fscan = new FolderScanner("/home/jason/Downloads", []);
// fscan.getFiles(true).then(list => console.log(list));
