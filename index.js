const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const inquirer = require('inquirer');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), updateTask);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

var todaysDate = '', 
  meetings = '', 
  singleDesc = '', 
  multiDesc = '',
  project = '',
  deliverables = '',
  status = '';

const spreadsheetId = '1jpSGfP5Aa1i3RO1DghIVfm_LEmde-0kM6NwGcvDqPMA'
const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

async function updateTask(auth) {
  await updateValues();

  var resource = {
    values: [
      [
        'Jeevan MB',
        'TNL21818938',
        'Dev',
        todaysDate,
        meetings,
        singleDesc,
        multiDesc,
        project,
        deliverables,
        status
      ],
    ]
  };

  console.log(resource);

  var confirmQuestion  = [
	{
		type: 'confirm',
		name: 'confirmation',
	  	message: 'Press any key to confirm or Command+C to exit tool.',
  	}
  ]

  inquirer.prompt(confirmQuestion).then(answers => {
  	// if it came here means some key was pressed, else app would have terminated.
  	uploadSheetRow(auth, resource);
  })
}

function uploadSheetRow(auth, resource) {
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Sheet1',
    valueInputOption: 'RAW',
    resource,
  }, (err, result) => {
    if (err) {
      // Handle error.
      console.log(err);
    } else {
      console.log(`Updated ${result.updates} \n\n`);
    }
  });
}

var questions = [
  {
    name: 'meetings',
    message: 'Meetings joined:',
    default: 'CastleCreeps Standup'
  },
  {
    name: 'taskSmall',
    message: 'Task Description:'
  },
  {
    name: 'taskBig',
    message: 'Task Detailed Description:'
  },
  {
    name: 'project',
    message: 'Project:',
    default: 'CastleCreeps'
  },
  {
    name: 'deliverable',
    message: 'Deliverables:',
    default: 'N/A'
  },
  {
    type: 'list',
    name: 'status',
    message: 'Status:',
    default: 'WIP',
    choices: ['WIP', 'Done']
  },
]; 

function updateValues() {
  var d = new Date();
  todaysDate = d.getDate() + '-' + months[d.getMonth()] + '-' + d.getFullYear();

  return inquirer
    .prompt(questions)
    .then(answers => {
      meetings = answers['meetings'];
      singleDesc = answers['taskSmall'];
      multiDesc = answers['taskBig'];
      project = answers['project'];
      deliverables = answers['deliverable'];
      status = answers['status'];
    })
    .catch(error => {
      if(error.isTtyError) {
        console.log('Prompt couldn\'t be rendered in the current environment')
      } else {
        console.log(error)
      }
    });
}