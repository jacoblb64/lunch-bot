const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
import * as dotenv from 'dotenv';

dotenv.config();


// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
// fs.readFile('credentials.json', (err, content) => {
//   if (err) return console.log('Error loading client secret file:', err);
//   // Authorize a client with credentials, then call the Google Sheets API.
//   authorize(JSON.parse(content), getUsers);
// });

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  const token = fs.readFileSync(TOKEN_PATH);
  oAuth2Client.setCredentials(JSON.parse(token));
  return(oAuth2Client);
};

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
export function getUsers(auth) {
  return new Promise((resolve, reject) => {
    const sheets = google.sheets({version: 'v4', auth});
  
    const optInPromise = new Promise((resolve, reject) => {
      console.log('Getting opted in users');
      sheets.spreadsheets.values.get({
        spreadsheetId: process.env.sheetID,
        range: 'Form Responses 1!A3:A1000',
      }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;
        let userList = [];
        if (rows.length) {
          // console.log('Name:');
          // emails are in column D
          fs.writeFileSync('optInUsers.txt', '');
          rows.map((row) => {
            // console.log(`${row[0]}`);
            fs.appendFileSync('optInUsers.txt', row + '\n');
            userList.push(row[0]);
          });
        } else {
          console.log('No data found.');
        }
        resolve(userList);
      });
    });

    const optOutPromise = new Promise((resolve, reject) => {
      console.log('Getting opted out users');
      
      // for not commenting the optout list and letting the opt in list 
      // do the work of both opt in an out
      resolve([]);
      // sheets.spreadsheets.values.get({
      //   spreadsheetId: process.env.sheetID,
      //   range: 'Form Responses 2!B2:B500',
      // }, (err, res) => {
      //   if (err) return console.log('The API returned an error: ' + err);
      //   const rows = res.data.values;
      //   let userList = [];
      //   if (rows.length) {
      //     // console.log('Name:');
      //     // emails are in column D
      //     fs.writeFileSync('optOutUsers.txt', '');
      //     rows.map((row) => {
      //       // console.log(`${row[0]}`);
      //       fs.appendFileSync('optOutUsers.txt', row + '\n');
      //       userList.push(row[0]);
      //     });
      //   } else {
      //     console.log('No data found.');
      //   }
      //   resolve(userList);
      // });
    });

    resolve(Promise.all([optInPromise, optOutPromise]));
  });
}

export const retrieveUsers = () => new Promise((resolve, reject) => {
  const credentials = fs.readFileSync('credentials.json');
  const authClient = authorize(JSON.parse(credentials));
  resolve(getUsers(authClient));
});

export const retrieveOnlyOptInUsers = () => new Promise((resolve, reject) => {
  retrieveUsers()
  .then((result) => {
    let inSet = new Set(result[0]);
    let outSet = new Set(result[1]);
    let diff = new Set([...inSet].filter(x => x && !outSet.has(x)));

    resolve([...diff]);
  });
});

// uncomment to 'run' this file
// retrieveOnlyOptInUsers()
// .then((result) => {
//   console.log(result);
// });