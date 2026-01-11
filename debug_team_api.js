
import https from 'https';

const token = 'GFq_uQHGZx2gOytpBcfjBfRly-la5D1BNr4LJmipbd3APZYYApE';
const listUrl = `https://api.pandascore.co/mlbb/teams?token=${token}&per_page=1`;

console.log('1. Fetching one team to get a valid ID...');

function fetch(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'Accept': 'application/json' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(data));
                } else {
                    reject(new Error(`Status ${res.statusCode}: ${data}`));
                }
            });
        }).on('error', reject);
    });
}

async function test() {
    try {
        const teams = await fetch(listUrl);
        if (!teams || teams.length === 0) {
            console.error('No teams found!');
            return;
        }

        const team = teams[0];
        console.log(`Success. Got team: ${team.name} (ID: ${team.id})`);

        const detailUrl = `https://api.pandascore.co/mlbb/teams/${team.id}?token=${token}`;
        console.log(`2. Fetching details for ID ${team.id}...`);
        console.log(`URL: ${detailUrl}`);

        const detail = await fetch(detailUrl);
        console.log('Success! Team details fetched.');
        console.log('Name:', detail.name);
        console.log('ID:', detail.id);

    } catch (err) {
        console.error('Test failed:', err.message);
    }
}

test();
