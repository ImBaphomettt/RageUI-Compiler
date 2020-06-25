import * as filesystem from 'fs-extra';

import * as fs from 'fs';
import * as path from 'path';

export class Files {

    public readonly files: string[] = [
        "RMenu.lua",
        "menu/RageUI.lua",
        "menu/Menu.lua",
        "menu/MenuController.lua",
        "components/",
        "menu/elements/",
        "menu/items/",
        "menu/panels/",
        "menu/windows/",
    ];

    public readonly directory: string = "RageUI/src/client";

    public readonly filename: string = "./RageShared.lua";


    public onInit = (): void => {
        filesystem.exists(`${this.filename}`, (exists) => {
            if (exists)
                filesystem.remove(`${this.filename}`, () => console.log("File deleted successfully, Start generate process."));
            else
                console.log("File not exists")
        });
        filesystem.ensureFile(`${this.filename}`).then(() => {
            console.info('Create file successfully : ' + `${this.filename}`);
            this.onBuild();
        }).catch(error => {
            console.error(error);
        });
    };

    public onBuild = (): void => {
        // https://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
        const fetchDir = function (dir: any) {
            let results: any = [];
            let files = fs.readdirSync(dir);
            files.forEach(function (file) {
                file = path.resolve(dir, file);
                let stat = fs.statSync(file);
                if (stat && stat.isDirectory()) {
                    let subdir = fetchDir(file);
                    results = results.concat(subdir);
                } else {
                    results.push(file);
                }
            });
            return results;
        };
        const fetchFiles = function (dir: any, files: any, done: any) {
            let pending = files.length;
            let results: any = [];
            for (var index in files) {
                let file = path.resolve(dir, files[index]);
                let stat = fs.statSync(file);
                if (stat && stat.isDirectory()) {
                    let subdir = fetchDir(file);
                    results = results.concat(subdir);
                } else {
                    results.push(file);
                }
            }
            done(null, results);
        };
        fetchFiles(`${this.directory}`, this.files, function (err: any, results: any) {
            if (err) throw err;
            results.forEach(function (x: any) {
                let contents = fs.readFileSync(x, 'utf8')
                filesystem.appendFileSync("RageShared.lua", contents, 'utf8');
            });
        });
    };
}

new Files().onInit();
