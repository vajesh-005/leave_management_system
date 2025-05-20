require('dotenv').config();
const hapi = require('@hapi/hapi');
const { user } = require('./plugins/user');
const { leave } = require('./plugins/leave');

async function serverInit(){
    const server = hapi.server({
        port : process.env.API_PORT || 1234,
        host : process.env.DB_HOST,
        routes: {
            cors: {
              origin: ['http://localhost:5173'], 
              credentials: true
            }
          }
    })
    await server.register(user) 
    await server.register(leave)
    await  server.start();
    console.log('server started in ' , server.info.uri);
    
}
serverInit();