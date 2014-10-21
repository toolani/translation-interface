# Translation Interface

## About

A web interface for interacting with [go-translation-api][1].

## Installation

Simply clone this project and upload the content of the `web/` directory to your webserver.

Note that [go-translation-api][1]'s `transserver` must be available on the same domain under the `/api/` path. i.e. If you are installing to `www.yourserver.com`, the api server must be reachable at `www.yourserver.com/api/`.

[1]:https://github.com/petert82/go-translation-api