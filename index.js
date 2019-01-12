const fs = require('fs');
const http = require('http');
const url = require('url');
const PORT = process.env.PORT || 5000

const jsonData = fs.readFileSync(`${__dirname}/data/treks.json`, 'utf-8');

const trekData = JSON.parse(jsonData);

//console.log(trekData);

const server = http.createServer((req, res) => {

  const pathName = url.parse(req.url, true).pathname;

  //console.log(pathName);

  // PRODUCT OVERVIEW -------------------------------------------------
  if (pathName === '/') {
      res.writeHead(200, {'Content-type': 'text/html'});
      res.end('prova');
  }
  else if (pathName === '/favicon.ico') {
    // Da capire se funziona
    fs.readFile(`${__dirname}/data/img/favicon.png`, (err,data) => {
      res.writeHead(200, {'Content-type': 'image/png'});
      res.end(data);
    });
  }

  // NOT FOUND -------------------------------------------------------
  else {
      res.writeHead(404, {'Content-type': 'text/html'});
      res.end('ERROR: Page not found in the server');
  }
});

server.listen(PORT, 'localhost', () => {
  console.log(`Server started on port ${PORT}`);
});

