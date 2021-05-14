# node-version-validator

## Install

Install with `npm i --save github:Smart-Tag-Studio/node-version-validator`

## Use

You can use it in two ways:
1. Simply import or require it on a js file
```js
require('node-version-validator');
```

2. Add it to your npm script using `nvv` (node-version-validator), for example:
```json
"scripts": {
    "dev": "nvv && node ./scripts/dev.mjs",
}
```

## The problem

Read: https://medium.com/codeptivesolutions/want-to-check-node-version-before-project-get-executed-using-script-47cd32c2f1fe

## The solution

It tests that when you write:
```json
"engines": {
    "node": ">=17.0.0"
},
"engineStrict": true,
```
in the package json, it is respected when executing a script.
`engineStrict` will change the script to give an error (when true) to just a warning (when false or not used).

This is an example of the output:
```
$ npm run dev

> @my-scope/my-project@1.0.0 dev
> nvv && ./scripts/dev.mjs

You're currently running node 16.0.0. This project requires node >=17.0.0.
Change your node version and try again
```

What it does is to compare `process.versions` against the definition in the `package.json`.
