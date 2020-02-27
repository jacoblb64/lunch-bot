import { retrieveUserMap } from './postToSlack';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
const Fuse = require('fuse.js');
const stringify = require('csv-stringify/lib/sync');

dotenv.config();

retrieveUserMap()
.then((users) => {
    let slackNames = fs.readFileSync('optInUsers.txt').toString().split("\n");

    let fuseOptions = {
        keys: ['name', 'profile.display_name']
    };
    let fuse = new Fuse(users, fuseOptions);

    let rows = [['slackName', 'email', 'slack ID']];

    for (let slackname of slackNames) {
        let result = fuse.search(slackname)[0];
        let email = result.profile.email;
        console.log(`${slackname} maps to ${email}`);
        rows.push([slackname, email, result.id]);
    }
    return rows;
})
.then((rows) => {
    return stringify(rows);
})
.then((csvString) => {
    fs.writeFileSync('emailMapping.csv', csvString);
    console.log('printed the csv!');
});
