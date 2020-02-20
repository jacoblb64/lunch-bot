const { WebClient } = require('@slack/web-api');

// const postToSlack = (channel, msg) => {
//   const slack = new Slack.WebClient(process.env.slackToken);

//   slack.chat.postMessage(channel, msg, {
//     unfurl_links: true,
//     as_user: true,
//   });
// };

const getUsers = () =>
  new Promise((resolve, reject) => {
    const slack = new WebClient();
    slack.users.list({token: process.env.slackToken}, (err, x) => {
      const y = x.members.filter(user => !user.deleted).map(z => {
        return {
          id: z.id,
          name: z.real_name
        };
      });

      resolve(y);
    });
  });

const mapUsers = (group) => {
  const users = getUsers();
  users.filter()
}

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