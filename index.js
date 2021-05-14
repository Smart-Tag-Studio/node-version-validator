const semver = require('semver');
const pkg_json = process.env[`npm_package_json`];

if (!pkg_json) {
    console.log(`Run this script inside an npm script to receive the npm environmental variables`);
    process.exit(1);
}

const pkg = JSON.parse(require('fs').readFileSync(pkg_json, 'UTF-8'));

if (!pkg.engines) {
    process.exit(0);
}

Object.keys(process.versions).forEach((engine) => {
    const version = {
        required: pkg.engines[engine],
        current: process.versions[engine],
    };

    let matches;
    if (version.required && version.current) {
        matches = semver.satisfies(version.current, version.required);
    }
    
    if (matches === false) {
        if (pkg.engineStrict) {
            console.log(`You're currently running ${engine} ${version.current}. This project requires ${engine} ${version.required}.`);
            console.log(`Change your ${engine} version and try again`);
            process.exit(1);
        } else {
            console.log(`You're currently running ${engine} ${version.current}. This project recommends ${engine} ${version.required}.`);
        }
    }
});
