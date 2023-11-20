const Hapi = require('@hapi/hapi');
const routes = require('./routes');

// Membuat server dengan port 9000
const init = async () => {
    const server = Hapi.server({
        port: 9000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    server.route(routes);

    // console.log(getAllBooksHandler);

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`); 
};

init();