const baseRouter = require("express").Router();

baseRouter.head("/", (request, response) => {
  response.status(200).end();
});

baseRouter.get("/", (request, response) => {
  response.send(
    "<h1>Hello World!</h1><pre>" + request.query.mediaType + "</pre>"
  );
});

baseRouter.get("/tokenized", (request, response) => {
  response.send(
    '<!doctype html><html lang="en"><head><meta charset="UTF-8" /><title>TOKENIZED</title></head><body><h1>TOKENIZED</h1><pre style="font-size:18px;">' +
      JSON.stringify(request.query, null, 4) +
      "</pre></body></html>"
  );
});

baseRouter.get("/success", (request, response) => {
  if (request.query.isTokenized == "TRUE")
    response.send(
      '<!doctype html><html lang="en"><head><meta charset="UTF-8" /><title>APPROVED TOKENIZED</title></head><body><h1>APPROVED & TOKENIZED</h1><pre style="font-size:18px;">' +
        JSON.stringify(request.query, null, 4) +
        "</pre></body></html>"
    );
  else
    response.send(
      '<!doctype html><html lang="en"><head><meta charset="UTF-8" /><title>APPROVED</title></head><body><h1>APPROVED</h1><pre style="font-size:18px;">' +
        JSON.stringify(request.query, null, 4) +
        "</pre></body></html>"
    );
});

baseRouter.get("/failure", (request, response) => {
  response.send(
    '<!doctype html><html lang="en"><head><meta charset="UTF-8" /><title>DECLINED</title></head><body><h1>DECLINED</h1><pre style="font-size:18px;">' +
      JSON.stringify(request.query, null, 4) +
      "</pre></body></html>"
  );
});

module.exports = baseRouter;
