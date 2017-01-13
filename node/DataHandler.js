//   todo:

"use strict";

const FS = require ('fs'),
     DATASTORE = require('nedb'),
     COACHES = new DATASTORE({ filename: './data/coaches_db.json', autoload: true }),
     DB = new DATASTORE({ filename: './data/log_db.json', autoload: true });
     this.data = [];

class DataHandler {
	constructor() {

	}

     static loadCerts() {
          const CERTS = {
               key: FS.readFileSync('./data/certs/server.enc.key'),
               cert: FS.readFileSync('./data/certs/server.crt')
          };
          return CERTS;
     }

     static loadCoachData(filePath) {
          return FS.readFileSync(filePath, 'utf8');
     }

     loadLogData(callback) {
          DB.find({}, (err, docs) => {
               if (docs.length != null) {
                    callback(docs);
               }
          });
     }

     updateData(data) {
          DB.update({ _id: data.id }, {
                 instructor_id: data.instructor_id
               , lastName: data.lastName
               , firstName: data.firstName
               , date: data.date
               , location: data.location
               , event: data.event
          }, { upsert: true,
               returnUpdatedDocs: true });
     }

     addData(data) {
          delete data.id;  // remove id field out of JSON parameter
          DB.insert(data);
     }

     /*queryData(data) { // keep as a reference for method below
      const THAT = this; //change to arrow function later
      // console.log(`DataHandler output: ${data.id}`);
      DB.findOne({ _id: data.id }, function(err, docs) {
      if (docs == null) {
      THAT.addData(data);
      } else {
      THAT.updateData(data);
      }
      });
      }*/

     queryData(data) {
          DB.findOne({ _id: data.id }, (err, docs) => {
               if (docs == null) {
                    this.addData(data);
               } else {
                    this.updateData(data);
               }
          });
     }
}

module.exports = DataHandler;