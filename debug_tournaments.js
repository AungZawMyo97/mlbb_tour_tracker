
import https from 'https';

const token = 'GFq_uQHGZx2gOytpBcfjBfRly-la5D1BNr4LJmipbd3APZYYApE';
const url = `https://api.pandascore.co/mlbb/tournaments/running?token=${token}`;

console.log(`Fetching ${url}...`);

https.get(url, { headers: { 'Accept': 'application/json' } }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        if (res.statusCode === 200) {
            const tournaments = JSON.parse(data);
            if (tournaments.length > 0) {
                const t = tournaments[0];
                console.log('--- Tournament Sample ---');
                console.log('Name:', t.name);
                console.log('Prize Pool:', t.prizepool);
                console.log('League:', JSON.stringify(t.league, null, 2));
                console.log('Serie:', JSON.stringify(t.serie, null, 2));
                console.log('Full Object Keys:', Object.keys(t));
            } else {
                console.log('No running tournaments found.');
            }
        } else {
            console.log('Error:', res.statusCode, data);
        }
    });
}).on('error', (err) => console.log('Error:', err.message));
