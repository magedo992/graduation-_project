const admin = require('firebase-admin');
const fs = require('fs');

const path = require('path');
const serviceAccount = JSON.parse(fs.readFileSync(path.join(__dirname, '../nabta-f65ea-firebase-adminsdk-cqk5z-d2c12aa2fa.json'), 'utf8'));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
