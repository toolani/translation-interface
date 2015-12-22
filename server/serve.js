var fs = require('fs')
var http = require('http')
var httpProxy = require('http-proxy')
var moment = require('moment')
var path = require('path')
var url = require('url')
var baseDirectory =  path.resolve(__dirname, path.join('..', 'web'))

// HTTP server will listen on this port
var webPort = 8080
// The React app expects the translation JSON API to be available under this path.
var apiRoot = '/translation-api'

// Will proxy requests to the JSON API
var apiProxy = httpProxy.createProxyServer({target:'http://localhost:8181'})

// Rewrite requests to remove the apiRoot from the path.
apiProxy.on('proxyReq', function(proxyReq) {
    if (proxyReq.path === apiRoot) {
        proxyReq.path = '/'
    } else {
        proxyReq.path = proxyReq.path.substr(apiRoot.length)
    }
})

apiProxy.on('proxyRes', function(proxyRes, req) {
    logRequest(req, proxyRes)
})

apiProxy.on('error', function (err, req, res) {
    res.writeHead(500)
    res.end()
    logRequest(req, res)
})

// Proxy API requests to the API, or otherwise, try to serve the requested file from the web/ 
// subdirectory
http.createServer(function(req, res) {
    var requestUrl = url.parse(req.url)
    var apiRegex = new RegExp('^' + apiRoot)
    
    try {
        if (apiRegex.test(requestUrl.pathname)) {
            apiProxy.web(req, res)
        } else {
            serveFile(req, res)
        }
    } catch(e) {
        if (!res.finished) {
            res.writeHead(500)
            res.end()
        }
        logRequest(req, res)
    }
}).listen(webPort)

console.log('Listening on port', webPort)

var serveFile = function(req, res) {
    var requestUrl = url.parse(req.url)
    var fsPath = baseDirectory + requestUrl.pathname
    
    if (requestUrl.pathname === '/') {
        fsPath += 'index-dev.html'
    }
    
    fs.exists(fsPath, function(exists) {
        if (exists) {
            res.writeHead(200)
            var responseStream = fs.createReadStream(fsPath).pipe(res)
            responseStream.on('finish', function () { 
                res.end()
                logRequest(req, res)
            })
        } else {
            res.writeHead(404)
            res.end()
            logRequest(req, res)
        }
    })
}

var logRequest = function (req, res) {
    var requestUrl = url.parse(req.url)
    var date = moment().format('DD/MMM/YYYY:HH:mm:ss ZZ')
    var logLine = req.socket.remoteAddress + ' [' + date + ']  "' + req.method + ' ' + requestUrl.pathname + '" ' + res.statusCode
    console.log(logLine)
}