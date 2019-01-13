const fs = require('fs');
const http = require('http');
const url = require('url');
const PORT = process.env.PORT || 5000

const jsonData = fs.readFileSync(`${__dirname}/data/treks.json`, 'utf-8');
const trekData = JSON.parse(jsonData);

const tmpl = {

  mainPage: '/pages/html_templates/template-mainpage.html',
  mainPageNationItem: '/pages/html_templates/template-mainpage-nation-item.html',
  nationPage: '/pages/html_templates/template-nationpage.html'
}
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
const server = http.createServer((req, res) => {

  const pathName = url.parse(req.url, true).pathname;

  console.log(pathName);

  // MAIN PAGE -------------------------------------------------------
  if (pathName === '/') {
    res.writeHead(200, {'Content-type': 'text/html'});

    const nationsList = extractListOfNationsFromTrek(trekData);
    fs.readFile(`${__dirname}${tmpl.mainPage}`, 'utf-8', (err, data) => {
      let mainpageOutput = data;
      fs.readFile(`${__dirname}${tmpl.mainPageNationItem}`, 'utf-8', (err, data) => {
        nationsOutput = nationsList.sort().map((nation, ndx) => parseNationsTemplate(data, nation, ndx)).join('');
        mainpageOutput = mainpageOutput.replace(/{%NATIONS%}/g, nationsOutput);
        res.end(mainpageOutput);
      });
    });
  }
  // NATION PAGE -----------------------------------------------------
  else if ((/\/nat\/.*.html/i).test(pathName)) {
    res.writeHead(200, {'Content-type': 'text/html'});
    fs.readFile(`${__dirname}${tmpl.nationPage}`, 'utf-8', (err, data) => {
      res.end('nation page');
    });

  }
  // IMAGES ----------------------------------------------------------
  else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
    fs.readFile(`${__dirname}/pages/imgs${pathName}`, (err,data) => {
        res.writeHead(200, {'Content-type': 'image/jpg'});
        res.end(data);
    });
  }
  // STYLE SHEET -----------------------------------------------------
  else if ((/\.css$/i).test(pathName)) {
    fs.readFile(`${__dirname}/pages/css${pathName}`, (err,data) => {
        res.writeHead(200, {'Content-type': 'text/css'});
        res.end(data);
    });
  }

  // NOT FOUND -------------------------------------------------------
  else {
      res.writeHead(404, {'Content-type': 'text/html'});
      res.end('ERROR: Page not found in the server');
  }
});

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// ------------------------------------------------------------------------------------
function extractListOfNationsFromTrek(trekData) {
  let nations = [];
  trekData.forEach(el => nations.includes(el.nation) || nations.push(el.nation));
  return nations;
}

// ------------------------------------------------------------------------------------
function parseNationsTemplate(data, nation, ndx) {
  const cssClass =  ndx % 2 ? 'divdark' : 'divlight';
  data = data.replace(/{%NATION%}/g, nation);
  data = data.replace(/{%NATION_LOWERCASE%}/g, nation.toLowerCase());
  data = data.replace(/{%CSSCLASS%}/g, cssClass);
  return data;
}

