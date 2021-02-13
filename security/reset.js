const fs = require('fs');
const PubNub = require('pubnub');

const configFile = fs.readFileSync('./security/config.json');
const config = JSON.parse(String(configFile));

const pubnub = new PubNub(config.credentials);
const grants = config.grants.map((grant) => pubnub.grant(grant));

Promise.all(grants)
  .then(() => {
    console.log('Permissions reset successfull');
  })
  .catch((error) => {
    console.error('Error resetting permissions');
    console.log(error);
  });
