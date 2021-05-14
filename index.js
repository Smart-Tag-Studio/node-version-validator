#!/usr/bin/env node
const semver = require('semver');
const pkg_json = process.env[`npm_package_json`];
const pkg_name = process.env[`npm_package_name`];
let pkg;

try {
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

    Object.keys(pkg.engines).forEach((engine) => {
        const version = {
            required: pkg.engines[engine],
            current: process.versions[engine],
        };

        let matches;
        if (version.required && version.current) {
            matches = semver.satisfies(version.current, version.required);
        } else {
            console.error(`Unable to test ${engine} ${version.required}. Please open an issue on github: https://github.com/Smart-Tag-Studio/node-version-validator/issues`)
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
} catch(e) {
    console.error(`\x1b[31m[node-version-validator] Something went wrong. ERROR STARTS HERE`);
    console.error(e);
    console.error(`\x1b[31m[node-version-validator] Something went wrong. ERROR ENDS HERE.\x1b[33m Please open an issue on github: https://github.com/Smart-Tag-Studio/node-version-validator/issues and send us the error above\x1b[37m`);
}
