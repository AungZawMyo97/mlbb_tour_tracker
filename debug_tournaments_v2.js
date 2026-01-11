
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
                // Inspect first 3 tournaments to get a better sample
                tournaments.slice(0, 3).forEach((t, i) => {
                    console.log(`\n--- Tournament ${i + 1} ---`);
                    console.log('Name:', t.name);
                    console.log('Prize Pool:', t.prizepool);
                    console.log('Serie Prizepool:', t.serie?.prizepool);
                    console.log('League Location:', t.league?.location);
                    console.log('Serie Location:', t.serie?.location); // check availability
                    console.log('Serie Description:', t.serie?.description);
                });
            } else {
                console.log('No running tournaments found.');
            }
        }
    });
});
