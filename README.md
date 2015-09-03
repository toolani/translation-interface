# Translation Interface

## About

A web interface for interacting with [go-translation-api][1].

## Requirements

You will need [npm][npm] and [grunt][grunt] installed to be able to build the project.

The API provided by [go-translation-api][1]'s `serve` command must be available on the same domain you intend to run this interface on under the `/translation-api/` path. i.e. If you are installing to `www.yourserver.com`, the api server must be reachable at `www.yourserver.com/translation-api/`.

## Installation

1. Clone this project.
2. Run `npm install` in the project's root directory.
3. Run `grunt` in the project's root directory.
4. Upload the content of the `web/` directory to your webserver.

[1]:https://github.com/petert82/go-translation-api
[npm]: https://www.npmjs.com/
[grunt]: http://gruntjs.com/