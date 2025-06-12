const https=require('https');
exports.keepalive=function keepalive(){
    const SERVER_URL = 'https://graduation-project-hvey.onrender.com'; 
const INTERVAL = 10 * 60 * 1000; 

function pingServer() {
  https.get(SERVER_URL, (res) => {
    console.log(`Pinged server. Status code: ${res.statusCode}`);
  }).on('error', (err) => {
    console.error(`Error pinging server: ${err.message}`);
  });
}


pingServer();


setInterval(pingServer, INTERVAL);
}
