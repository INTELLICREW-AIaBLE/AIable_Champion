const fetch = require('node-fetch');

async function test() {
  const apiKey = 'AIzaSyDBJsZR75syN9LT30rblGex6RHHtHJl-l8';
  const cx = 'f11d1ee43f0544f3d';
  const query = 'Hồ Chí Minh sinh ngày 19 tháng 5 năm 1890';
  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&num=3`;
  
  try {
    const r = await fetch(url);
    const d = await r.json();
    console.log(JSON.stringify(d, null, 2));
  } catch (e) {
    console.log(e);
  }
}

test();
