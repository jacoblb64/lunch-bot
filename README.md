# Haven Lunch Match!

## Things you'll need to get started

#### Google Sheets API credentials
* Download `credentials.json` from https://developers.google.com/sheets/api/quickstart/nodejs
* Place it in the root of the project directory

#### Slack token
* Grab it from the api.slack.com
* Under 'Your Apps' > lunch-match > OAuth & Permissions
* place in .env as `slackToken=[token]`

#### Generate your Google Sheets API token
* `npm run build`
* `npm run generate-token`
* Follow the steps in the console by visiting the link and pasting the code

#### Grab google sheet id
* It's the end of the URL on a google sheet like https://docs.google.com/spreadsheets/d/[this code]
* Place in .env as `sheetID=[sheetID]`

## Testing and running
* `npm run build` to build the code
* `npm run dryrun` to retrieve from sheets, but `console.log()` instead of posting to slack
* `npm run lunchmatch` to actually run and create Slack DM's!