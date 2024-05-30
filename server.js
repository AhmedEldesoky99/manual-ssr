const { readFileSync } = require("fs");
const { createServer } = require("http");
const { parse } = require("url");
const { renderToString } = require("react-dom/server");
const React = require("react");

const App = require("./frontend/app");

const PORT = 3000;

const htmlTemplate = readFileSync(`${__dirname}/index.html`, "utf-8");
const clientJS = readFileSync(`${__dirname}/hydration.js`, "utf-8");

const server = createServer((req, res) => {
  const pathName = parse(req.url, true).pathname;

  switch (pathName) {
    case "/":
      const renderedReact = renderToString(<App />);
      const html = htmlTemplate.replace("%%%CONTENT%%%", renderedReact);
      res.writeHead(200, { "Content-type": "text/html" });
      res.end(html);
      break;

    case "/hydration.js":
      res.writeHead(200, { "Content-type": "application/javascript" });
      res.end(clientJS);
      break;

    default:
      res.end("The URL cannot be found");
  }
});

server.listen(PORT, () =>
  console.log(`Listening for requests on port ${PORT}`)
);
