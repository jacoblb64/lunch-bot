const { WebClient } = require('@slack/web-api');
import * as _ from 'lodash';

const retrieveUserMap = () =>
  new Promise((resolve, reject) => {
    const slack = new WebClient(process.env.slackToken);
    slack.users.list()
    .then(users => {
      let members = users.members.filter(m => !m.deleted && !m.is_bot);
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
    return result ? result.id : '';
  });
};

const postToSlack = (channel, msg) => {
  const slack = new WebClient(process.env.slackToken);
  slack.chat.postMessage({
    token: process.env.slackToken,
    channel: channel,
    text: msg
  }).then(mess => {
    console.log(msg, 'posted');
  });
};

const createMessage = (group) => {
  const start = "It’s time to plan your Lunch Match! The group is "; 
  const names = group.join(', ');
  const base = ". \nSome things to consider: \n- Set up a time \n- Decide what to eat \n- Check if anyone has dietary restrictions \n- In the office or out of the office?";
  return start + names + base;
};

const addUsers = (channel, users) => {
  const slack = new WebClient(process.env.slackToken);
  slack.conversations.invite({
    token: process.env.slackToken,
    channel: channel,
    users: users
  }).then(mess => {});
}

const initChannels = (groups, userMap) => {
  const slack = new WebClient(process.env.slackToken); 
  groups.forEach(group => {
    let chanName = `${Math.floor(Math.random() * 10000)}-test-channel`;
    let users = getUserIDsFromNames(userMap, group).join(',');
    console.log(chanName, ' with ', users);
    slack.conversations.create({
      token: process.env.slackToken,
      name: chanName,
      is_private: true,
      user_ids: users
    }).then(x => {
      const channel = x.channel.id;
      console.log(channel);
      addUsers(channel, users);
      postToSlack('#'+chanName, createMessage(group));
    });
  });
}


export { getUserIDsFromNames };
export { retrieveUserMap };
export { initChannels, postToSlack, createMessage };
