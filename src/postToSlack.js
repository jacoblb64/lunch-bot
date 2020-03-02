const { WebClient } = require('@slack/web-api');
import * as _ from 'lodash';
import * as dotenv from "dotenv";

dotenv.config();
const dryRun = process.argv.includes('--dry-run');;

export const retrieveUserMap = () =>
  new Promise((resolve, reject) => {
    const slack = new WebClient(process.env.slackToken);
    slack.users.list()
    .then(users => {
      let members = users.members.filter(m => !m.deleted && !m.is_bot);
      members = members.map(m => {m.displayname = m.profile.display_name; return m;});
      resolve(members);
    });
  });

export const getUserIDsFromNames = (users, group) => {
  if (!users) {
    console.log('users not retrieved');
    return;
  }

  return group.map(u => {
    let result = users.find(user => user.name === u) || users.find(user => user.displayname === u);
    return result ? result.id : '';
  });
};

export const getUserIDsFromEmails = (users, group) => {
  if (!users) {
    console.log('users not retrieved');
    return;
  }

  return group.map(u => {
    let result = users.find(user => user.profile.email === u);
    return result ? result.id : '';
  });
}

export const getDisplayNamesFromEmails = (users, group) => {
  if (!users) {
    console.log('users not retrieved');
    return;
  }

  const names = group.map(u => {
    let result = users.find(user => user.profile.email === u);
    return result ? (result.name || result.displayname) : '';
  });
  // console.log(names);
  return names;
}

export const postToSlack = (channel, msg) => {
  const slack = new WebClient(process.env.slackToken);

  if (!dryRun) {
    return slack.chat.postMessage({
      token: process.env.slackToken,
      channel: channel,
      text: msg
    });
  }
  else {
    console.log(`Posting message to slack in ${channel} saying ${msg}`);
  }
};

const createMessage = (group) => {
  console.log(group);
  const start = "It’s time to plan your Lunch Match! The group is "; 
  const names = group.join(', ');
  const base = ". \nSome things to consider: \n- Set up a time \n- Decide what to eat \n- Check if anyone has dietary restrictions \n- In the office or out of the office?";
  const feedback = "\n\nPlease let us know what you think! http://bit.ly/LunchMatchFeedback";
  const unsub = "\n\nIf you want to unsubscribe from future weeks, please fill out: http://bit.ly/LunchMatchUnsubscribe";
  return start + names + base + feedback + unsub;
};

export const addUsers = (channel, users) => {
  const slack = new WebClient(process.env.slackToken);

  if (!dryRun) {
    return slack.conversations.invite({
      token: process.env.slackToken,
      channel: channel,
      users: users
    });
  }
  else {
    console.log(`adding ${users} to ${channel}`);
  }
}

export const createChannel = (users) => {
  const slack = new WebClient(process.env.slackToken);

  if (!dryRun) {
    return slack.conversations.open({
      token: process.env.slackToken,
      users: users
    })
  }
  else {
    console.log(`creating a conversation for ${users}`);
    return({'channel': {'id': 0}});
  }
};

export const initChannels = (groups, userMap) => {
  groups.forEach(group => {
    let users = getUserIDsFromEmails(userMap, group).join(',');
    let displayNames = getDisplayNamesFromEmails(userMap, group);

    let create = new Promise((resolve) => {
      resolve(createChannel(users));
    });

    create
    .then(x => {
      const channel = x.channel.id;
      return {channel, users, displayNames};
    }).then(obj => {
      addUsers(obj.channel, obj.users);
      return obj;
    }).then(obj => {
      postToSlack(obj.channel, createMessage(obj.displayNames));
    });
  });
}