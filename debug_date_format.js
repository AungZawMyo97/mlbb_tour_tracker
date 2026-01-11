
import https from 'https';

const token = 'GFq_uQHGZx2gOytpBcfjBfRly-la5D1BNr4LJmipbd3APZYYApE';
const url = `https://api.pandascore.co/mlbb/matches/past?token=${token}&per_page=10&sort=-begin_at`;

https.get(url, { headers: { 'Accept': 'application/json' } }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        if (res.statusCode === 200) {
            const matches = JSON.parse(data);
            const validMatches = matches.filter(m => m.begin_at);

            if (validMatches.length > 0) {
                validMatches.slice(0, 3).forEach((m, i) => {
                    console.log(`\n--- Match ${i + 1} ---`);
                    console.log('Name:', m.name);
                    console.log('Begin At Raw:', m.begin_at);
                });
            } else {
                console.log('No matches with dates found.');
            }
        }
    });
});
