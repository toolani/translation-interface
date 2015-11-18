# Translation Interface

## About

A web interface for interacting with [go-translation-api][1].

## Requirements

You will need [npm][npm] and [grunt][grunt] installed to be able to build the project.

You will also need a compiled version of the [go-translation-api][1].

## Installation on an existing web server

The API provided by go-translation-api's `serve` command must be available on the same domain you intend to run this interface on under the `/translation-api/` path. i.e. If you are installing to `www.yourserver.com`, the api server must be reachable at `www.yourserver.com/translation-api/`.

1. Clone this project.
2. Run `npm install` in the project's root directory.
3. Run `grunt` in the project's root directory.
4. Upload the content of the `web/` directory to your webserver.

## Local installation

A nodejs web server is provided for testing the translation interface.

1. Clone this project.
2. Run `npm install` in the project's root directory.
3. Run `grunt` in the project's root directory.
4. Ensure the go-translation-api's `serve` command is running on your local machine on port 8181.
5. Run `npm run serve` from the project's root directory. This will start a web server on port 8080 providing access to the translation interface. Simply access http://localhost:8080/ in your web browser to get started.

[1]:https://github.com/petert82/go-translation-api
[npm]: https://www.npmjs.com/
[grunt]: http://gruntjs.com/