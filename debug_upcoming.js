
import https from 'https';

const token = 'GFq_uQHGZx2gOytpBcfjBfRly-la5D1BNr4LJmipbd3APZYYApE';
const url = `https://api.pandascore.co/mlbb/tournaments/upcoming?token=${token}`;

https.get(url, { headers: { 'Accept': 'application/json' } }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        if (res.statusCode === 200) {
            const tournaments = JSON.parse(data);
            if (tournaments.length > 0) {
                tournaments.slice(0, 3).forEach((t, i) => {
                    console.log(`\n--- Upcoming Tournament ${i + 1} ---`);
                    console.log('Name:', t.name);
                    console.log('Prize Pool:', t.prizepool);
                    console.log('Serie:', t.serie ? 'Present' : 'Missing');
                    if (t.serie) {
                        console.log('Serie Prizepool:', t.serie.prizepool);
                        console.log('Serie Tier:', t.serie.tier);
                    }
                    console.log('League:', t.league ? 'Present' : 'Missing');
                    if (t.league) {
                        console.log('League Name:', t.league.name);
                    }
                });
            } else {
                console.log('No upcoming tournaments found.');
            }
        }
    });
});
