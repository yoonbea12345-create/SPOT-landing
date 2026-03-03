import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

console.log('=== 최근 accessLogs 10건 ===');
const [rows] = await conn.execute(
  'SELECT id, ipAddress, pathname, gpsLat, gpsLng, durationSec, timestamp FROM accessLogs ORDER BY id DESC LIMIT 10'
);
console.table(rows);

console.log('\n=== gpsLat 있는 레코드 수 ===');
const [gpsRows] = await conn.execute(
  'SELECT COUNT(*) as cnt FROM accessLogs WHERE gpsLat IS NOT NULL'
);
console.log('GPS 수집:', gpsRows[0].cnt, '건');

console.log('\n=== durationSec 있는 레코드 수 ===');
const [durRows] = await conn.execute(
  'SELECT COUNT(*) as cnt FROM accessLogs WHERE durationSec IS NOT NULL AND durationSec > 0'
);
console.log('체류시간 수집:', durRows[0].cnt, '건');

await conn.end();
