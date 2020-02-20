import Promise from 'polyfill-promise';
import { getLunch, getSlackNames, getGoogleSheetUsers } from './getSheets';
import { getNextLunch, getDateColumn } from './getNextLunchDate';
import { formatForGeneral, getUsers } from './parseNames';
import { postToSlack } from './postToSlack';
import * as dotenv from "dotenv";

dotenv.config();

let namesObj = {};

const formatSlackNames = names => names.map(x => ` <@${x}>`);
const slackNames = ['<@zacknotzach>', '<@kamran>', '<@jacob>'];

const parseData = (data, slackData) => {
  const dates = getDateColumn(data);
  const next = getNextLunch(dates);
  const names = formatForGeneral(data, next, namesObj, slackData);
  /* eslint max-len: "off" */
  const msg = `
    <!subteam^${process.env
      .groupID}|dayton> The following people are scheduled to help with lunch on Friday:
    ${names}

    ${process.env.sheetUrl}
  `;

  postToSlack('#-general', msg);
};

const getData = () => {
  const namesAndData = [getLunch(), getSlackNames(), getUsers()];

  Promise.all(namesAndData).then(x => {
    namesObj = x[1];
    parseData(x[0], x[2]);
  });
};

// const date = new Date();
// // thursday
// if (date.getDay() === 4) {
//   getData();
// }
const msg = 'Hello world';
postToSlack('#lunch-bot-test-channel', msg);
console.log(getGoogleSheetUsers());

