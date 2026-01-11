
import https from 'https';

const token = 'GFq_uQHGZx2gOytpBcfjBfRly-la5D1BNr4LJmipbd3APZYYApE';
const teamId = 130282; // ID from previous test

const url = `https://api.pandascore.co/teams/${teamId}?token=${token}`;

console.log(`Fetching ${url}...`);

https.get(url, { headers: { 'Accept': 'application/json' } }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        if (res.statusCode === 200) {
            console.log('Success! Body preview:', data.substring(0, 200));
        } else {
            console.log('Error Body:', data);
        }
    });
}).on('error', (err) => {
    console.log('Error: ' + err.message);
});
