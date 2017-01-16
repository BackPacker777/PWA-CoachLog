//  todo:

"use strict";

const DATA_HANDLER = require('./node/DataHandler'),
     QS = require('querystring'),
     EJS = require('ejs');

class app {
     constructor() {
          this.DataHandler = new DATA_HANDLER();
          this.ejsData = null;
          this.certData = DATA_HANDLER.loadCerts();
          this.loadServer();
     }

     loadServer() {
          const HTTPS = require('https'),
               EJS = require('ejs'),
               PORT = 9443,
               SERVER = HTTPS.createServer(this.certData, (req, res) => {
                    let httpHandler = (err, str, contentType) => {  //http://stackoverflow.com/questions/336859/var-functionname-function-vs-function-functionname
                         if (err) {
                              res.writeHead(500, { 'Content-Type': 'text/plain' });
                              res.end('An error has occurred: ' + err.message);
                         } else if (contentType.indexOf('image') >= 0) {
                              res.writeHead(200, {'Content-Type': contentType});
                              res.end(str, 'binary');
                         } else if (contentType.indexOf('html') >= 0) {
                              res.writeHead(200, { 'Content-Type': contentType });
                              res.end(EJS.render(str, {
                                   data: this.ejsData,
                                   filename: 'index.ejs' }));
                         } else {
                              res.writeHead(200, { 'Content-Type': contentType });
                              res.end(str, 'utf-8');
                         }
                    };

                    if (req.method == 'POST') {
                         if (req.headers['x-requested-with'] === 'XMLHttpRequest0') {
                              this.loadData(req, res, 0);
                         } else if (req.headers['x-requested-with'] === 'XMLHttpRequest1') {
                              this.loadData(req, res, 1);
                         } else {
                              console.log("[405] " + req.method + " to " + req.url);
                              res.writeHead(405, "Method not supported", { 'Content-Type': 'text/html' });
                              res.end('<html><head><title>405 - Method not supported</title></head><body><h1>Method not supported.</h1></body></html>');
                         }
                    } else if (req.url.indexOf('/javascripts/') >= 0) {
                         this.render(req.url.slice(1), 'application/ecmascript', httpHandler, 'utf-8');
                    } else if (req.url.indexOf('/css/') >= 0) {
                         this.render(req.url.slice(1), 'text/css', httpHandler, 'utf-8');
                    } else if (req.url.indexOf('/images/') >= 0) {
                         this.render(req.url.slice(1), 'image/png', httpHandler, 'binary');
                    } else if (req.url.indexOf('/results.ejs') >= 0) {
                         this.render('public/views/results.ejs', 'text/html', httpHandler, 'utf-8');
                    } else {
                         this.render('public/views/index.ejs', 'text/html', httpHandler, 'utf-8');
                    }
               }).listen(PORT, _ => console.log('-= Server Listening at https://127.0.0.1:' + PORT + ' =-'));
     }

     render(path, contentType, callback, encoding) {
          const FS = require('fs');
          FS.readFile(__dirname + '/' + path, encoding ? encoding : 'utf-8', (err, str) => { // ternary
               callback(err, str, contentType);  // http://stackoverflow.com/questions/8131344/what-is-the-difference-between-dirname-and-in-node-js
          });
     }

     loadData(req, res, whichAjax) {
          if (whichAjax === 0) {
               let coach = {};
               req.on('data', (data) => {
                    let found = false;
                    let coaches = DATA_HANDLER.loadCoachData('data/coaches.csv');
                    const COLUMNS = 3;
                    let tempArray, finalData = [];
                    tempArray = coaches.split(/\r?\n/); //remove newlines
                    for (let i = 0; i < tempArray.length; i++) {
                         finalData[i] = tempArray[i].split(/,/).slice(0, COLUMNS);
                    }
                    for (let i = 0; i < finalData.length; i++) {
                         if (data == finalData[i][0]) {
                              found = true;
                              coach = {
                                   'coachID': finalData[i][0],
                                   'lastName': finalData[i][1],
                                   'firstName': finalData[i][2]
                              };
                              break;
                         }
                    }
                    if (found === false) {
                         res.writeHead(200, {'content-type': 'text/plain'});
                         res.end('false');
                    } else {
                         coach = JSON.stringify(coach);
                         res.writeHead(200, {'content-type': 'application/json'});
                         res.end(coach);
                    }
               });
          } else if (whichAjax === 1) {
               const FORMIDABLE = require('formidable');  // https://docs.nodejitsu.com/articles/HTTP/servers/how-to-handle-multipart-form-data
               let formData = {};
               new FORMIDABLE.IncomingForm().parse(req).on('field', (field, name) => {
                    formData[field] = name;
               }).on('error', (err) => {
                    next(err);
               }).on('end', () => {
                    // this.DataHandler.queryData(formData);
                    DATA_HANDLER.queryData(formData);
               });
          }
          /*new DATA_HANDLER().loadLogData((docs) => {
               let jsonDocs = JSON.stringify(docs); // http://stackoverflow.com/questions/5892569/responding-with-a-json-object-in-nodejs-converting-object-array-to-json-string
               res.writeHead(200, {'content-type': 'application/json'});
               res.end(jsonDocs);
               this.setEjsData();
          });*/
     }

     setEjsData() {
          new DATA_HANDLER().loadData((docs) => {
               this.ejsData = docs;
          });
     }
}

module.exports = app;