
import https from 'https';

const token = 'GFq_uQHGZx2gOytpBcfjBfRly-la5D1BNr4LJmipbd3APZYYApE';
const url = `https://api.pandascore.co/mlbb/matches/upcoming?token=${token}&per_page=3&sort=begin_at`;

console.log(`Fetching ${url}...`);

https.get(url, { headers: { 'Accept': 'application/json' } }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        if (res.statusCode === 200) {
            const matches = JSON.parse(data);
            if (matches.length > 0) {
                matches.forEach((m, i) => {
                    console.log(`\n--- Match ${i + 1} ---`);
                    console.log('Name:', m.name);
                    console.log('Status:', m.status);
                    console.log('Begin At:', m.begin_at);
                    console.log('Scheduled At:', m.scheduled_at);
                    console.log('Parsed Begin At:', new Date(m.begin_at).toString());
                });
            } else {
                console.log('No upcoming matches found.');
            }
        } else {
            console.log('Error:', res.statusCode, data);
        }
    });
});
