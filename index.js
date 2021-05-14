const semver = require('semver');
const pkg_json = process.env[`npm_package_json`];
const pkg_name = process.env[`npm_package_name`];
let pkg;

if (!pkg_name) {
    console.log(`Run this script inside an npm script to receive the npm environmental variables`);
    process.exit(1);
}

if (pkg_json) {
    pkg = JSON.parse(require('fs').readFileSync(pkg_json, 'UTF-8'));
} else {
    pkg = {
        engineStrict: !!process.env[`npm_package_engineStrict`],
        engines: Object.keys(process.env).filter(k => k.match(`npm_package_engines_`)).reduce((s,k) => { s[k.replace(`npm_package_engines_`, '')]=process.env[k]; return s; }, {}),
    };
}

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
