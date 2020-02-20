const { WebClient } = require('@slack/web-api');
import * as _ from 'lodash';

// const postToSlack = (channel, msg) => {
//   const slack = new Slack.WebClient(process.env.slackToken);

//   slack.chat.postMessage(channel, msg, {
//     unfurl_links: true,
//     as_user: true,
//   });
// };

const retrieveUserMap = () =>
  new Promise((resolve, reject) => {
    const slack = new WebClient(process.env.slackToken);
    slack.users.list()
    .then(users => {
      let members = users.members.filter(m => !m.deleted && !m.is_bot);
      console.log(members.length);
      members = members.map(m => {m.displayname = m.profile.display_name; return m;});
      resolve(members);
    });
  });

const getUserIDsFromNames = (users, group) => {
  if (!users) {
    console.log('users not retrieved');
    return;
  }

  return group.map(u => {
    let result = users.find(user => user.name === u) || users.find(user => user.displayname === u);
    console.log(result);
    return result ? result.id : '';
  });
};

const createChannels = (group) => {
  // groups.forEach(element => {
    
  // });
  const slack = new WebClient(); 
  slack.conversations.create({
    token: {token: process.env.slackToken},
    name: 'test-channel-name',
    is_private: true,
    user_ids: mapUsers(group)
  });
}


export { createChannels };
export { getUserIDsFromNames };
export { retrieveUserMap };