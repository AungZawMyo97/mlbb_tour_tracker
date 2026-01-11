
import https from 'https';

const token = 'GFq_uQHGZx2gOytpBcfjBfRly-la5D1BNr4LJmipbd3APZYYApE';
const url = `https://api.pandascore.co/mlbb/tournaments/running?token=${token}`;

https.get(url, { headers: { 'Accept': 'application/json' } }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        if (res.statusCode === 200) {
            const tournaments = JSON.parse(data);
            if (tournaments.length > 0) {
                tournaments.slice(0, 3).forEach((t, i) => {
                    console.log(`\n--- Tournament ${i + 1} ---`);
                    console.log('League Country:', t.league?.country);
                    console.log('serie Country:', t.serie?.country);
                    console.log('serie City:', t.serie?.city);
                });
            }
        }
    });
});
