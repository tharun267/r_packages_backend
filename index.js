const axios = require('axios');
const { parse } = require("debian-control");
const tar = require('tar-stream');
const zlib = require("zlib");
const fs = require('fs');

const rPackagesURL = 'http://cran.r-project.org/src/contrib/PACKAGES.gz';

function getGzipped(url) {
    return new Promise(async (resolve, reject) => {
        try {
            let buffer = [];
            const response = await axios({
                method: "get",
                url: url,
                responseType: "stream"
            });
            let gunzip = zlib.createGunzip();

            response.data.pipe(gunzip);

            gunzip.on('data', function (chunk) {
                buffer.push(chunk.toString('utf-8'))
            }).on("end", function () {
                resolve(buffer.join(""));
            }).on("error", function (e) {
                reject(e);
            })
        } catch (error) {
            reject(error);
        }
    })
}

function getGzippedWithFileName(url, fileName) {
    return new Promise(async (resolve, reject) => {
        try {
            const extract = tar.extract();
            let buffer = [];
            extract.on('entry', function (header, stream, cb) {
                stream.on('data', function (chunk) {
                    // Choosing a specific file
                    if (header.name == fileName) {
                        buffer.push(chunk.toString('utf-8'))
                    }
                });

                stream.on('end', function () {
                    cb();
                });

                stream.resume();
            });

            extract.on('finish', function () {
                resolve(buffer.join(""));
            });

            extract.on('error', function () {
                reject(error);
            });

            const response = await axios({
                method: "get",
                url: url,
                responseType: "stream"
            });

            let gunzip = zlib.createGunzip();

            response.data
                .pipe(gunzip)
                .pipe(extract);

        } catch (error) {
            reject(error);
        }
    });
}

async function main(start, end) {
    try {
        const rPackagesData = await getGzipped(rPackagesURL);
        const rPackagesDataList = rPackagesData.split("\n\n");

        // Making limited API calls using slice [a batch of 5];
        const rPackagePromises = rPackagesDataList.slice(start, end)
            .map(async rPackage => {
                let rPackageJSON = {};
                let RPackageURL = '';
                let rPackageDescJSON = {};
                try {
                    rPackageJSON = parse(rPackage);
                    // named URL in PascalCase as all keys in Object are PascalCased
                    RPackageURL = `http://cran.r-project.org/src/contrib/${rPackageJSON.Package}_${rPackageJSON.Version}.tar.gz`;
                    RPackageDesc = await getGzippedWithFileName(RPackageURL, `${rPackageJSON.Package}/DESCRIPTION`);
                    rPackageDescJSON = parse(RPackageDesc);
                } catch (err) {
                    console.log(err);
                }
                return { ...rPackageJSON, ...rPackageDescJSON, RPackageURL }
            });

        const rPackageList = await Promise.all(rPackagePromises);
        let fileJSON = JSON.parse(fs.readFileSync('rPackagesList.json').toString());
        fs.writeFileSync('rPackagesList.json', JSON.stringify([...fileJSON, ...rPackageList]));
        // Repeat
        main(end + 5, end + (2 * 5));

    } catch (error) {
        console.log(error);
    }
}


main(0, 5);



