const fetch = require('node-fetch');
fetch('http://localhost:3000/api/safaris')
  .then(r => r.json())
  .then(d => console.log('API Returned length:', d.length))
  .catch(e => console.error(e.message));
