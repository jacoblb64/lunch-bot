import googleAPI from 'google-sheets-api';
/* eslint no-unused-vars: "off" */
import Promise from 'polyfill-promise';
const { Client } = require('pg');

const config = require('../pg-config');



const Sheets = googleAPI.Sheets;
const id = process.env.sheetID;
const serviceEmail = process.env.serviceEmail;
const serviceKey = process.env.sheetPem;

const getLunch = () => {
  const sheet = new Sheets({ email: serviceEmail, key: serviceKey });

  return sheet.getSheets(id).then(info => {
    const cells = sheet.getCells(id, info[0].id);

    return cells;
  });
};

// const getSlackNames = () =>
//   new Promise((resolve, reject) => {
//     const postgres = new Client(config);
//     postgres.connect();
//     postgres.query({ text: 'select name,slackid from helpers' }, (err, res) => {
//       if (!err) {
//         resolve(res.rows);
//       } else {
//         reject(err);
//       }
//       postgres.end();
//     });
//   });

const getSlackNames = () => {
  sheets.getSheets(id)
  .then(function(sheetsInfo) {
    // NOTE: Using first sheet in this example
    var sheetInfo = sheetsInfo[0];
    return Promise.all([
      sheets.getSheet(id, sheetInfo.id),
      sheets.getRange(id, sheetInfo.id, 'A1:A10')
    ]);
  })
  .then(function(sheets) {
    console.log('Sheets metadata:', sheets[0]);
    console.log('Sheets contents:', sheets[1]);
  })
  .catch(function(err){
    console.error(err, 'Failed to read Sheets document');
  });

};

export { getLunch, getSlackNames };
