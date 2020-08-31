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
  console.log(`Posting message to slack in ${channel} saying ${msg}`);

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
  const start = "It’s time to plan your Haven Hangs meetup! The group is "; 
  const names = group.join(', ');
  const hangsPrompt = ".\nTo kick-off the conversation, use the following prompt, with each person sharing!\n";
  const randomPrompts = ["What is one thing that you’ve learned over the last six months? ", 
  "Do have a new hobby that you’ve developed over the last year? If so, what is it, and how did you learn it? Are there any new hobbies that you’d like to learn and haven’t yet?",
  "Fall is fast approaching! What are some of your favorite fall memories from childhood? Are there any fall activities that you are looking forward to?",
  "Halloween is just around the corner. If you celebrated as a child, what was your favorite costume? What has been your favorite costume as an adult? ",
  "What is something that you were once afraid of, but no longer are? How did you get over that fear?",
  "If you could open a restaurant, what would you serve? Is there a specific dish you would make sure is on the menu?"
  ];
  // const base = ". \nSome things to consider: \n- Set up a time \n- Decide what to eat \n- Check if anyone has dietary restrictions \n- In the office or out of the office?";
  // const feedback = "\n\nPlease let us know what you think! http://bit.ly/LunchMatchFeedback";
  // const unsub = "\n\nIf you want to unsubscribe from future weeks, please fill out: http://bit.ly/LunchMatchUnsubscribe";
  // const newBase = ". \n PLEASE REACT WITH :thumbsup: or :thumbsdown:\n Which day can you get together for lunch?\n\n";
  // const otherNewBase = ".\nVOTE HERE BY REACTING TO WHICH DAYS WORK BEST FOR YOU! (:one: for Monday, :two: for Tuesday, etc.). Then arrange to make it happen.";
  // return start + names + base + feedback + unsub;
  return start + names + hangsPrompt + randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
};

const askOpt = (name) => {
  return 'For this week, opt in or opt out ' + name;
}

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
  console.log(groups);
  groups && groups.forEach(group => {
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
      return obj;
    // }).then(obj => {
    //   postToSlack(obj.channel, 'Monday\n');
    //   return obj;
    // }).then(obj => {
    //   postToSlack(obj.channel, 'Tuesday\n');
    //   return obj;
    // }).then(obj => {
    //   postToSlack(obj.channel, 'Wednesday\n');
    //   return obj;
    // }).then(obj => {
    //   postToSlack(obj.channel, 'Thursday\n');
    //   return obj;
    // }).then(obj => {
    //   postToSlack(obj.channel, 'Friday\n');
    //   return obj;
    // }).then(obj => {
    //   postToSlack(obj.channel, "Sorry, I can't make it :(");
    });
  });
}

export const requestOpt = (names, userMap) => {
  names.forEach(name => {
    let user = getUserIDsFromEmails(userMap, [name]);
    console.log('getting user from emails: '+ user);
    let displayName = getDisplayNamesFromEmails(userMap, [name]);

    let create = new Promise((resolve) => {
      resolve(createChannel(user));
    });

    create
    .then(x => {
      const channel = x.channel.id;
      return {channel, user, displayName};
    }).then(obj => {
      addUsers(obj.channel, obj.user);
      return obj;
    }).then(obj => {
      postToSlack(obj.channel, askOpt(obj.displayName));
      return obj;
    });
  });
}