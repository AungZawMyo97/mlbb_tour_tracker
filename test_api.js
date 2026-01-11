
import https from 'https';

const token = 'GFq_uQHGZx2gOytpBcfjBfRly-la5D1BNr4LJmipbd3APZYYApE';
const url = `https://api.pandascore.co/mlbb/teams?token=${token}&per_page=100`;

const options = {
    headers: {
        'Accept': 'application/json',
    }
};

console.log(`Fetching ${url} with headers...`);

https.get(url, options, (res) => {
    console.log('Status Code:', res.statusCode);
    console.log('Status Message:', res.statusMessage);

    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log('Response Body Preview:', data.substring(0, 200));
        } else {
            console.log('Error Response:', data);
        }
    });

}).on('error', (err) => {
    console.log('Error: ' + err.message);
});
