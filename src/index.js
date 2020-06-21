const server = require('./app/server');

require('dotenv').config();

require('./app/controllers/index.js')(server);

server.listen(3000, () => {
    console.log('Started');    
});