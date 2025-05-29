require('dotenv').config();

const Hapi = require('@hapi/hapi');
const AlbumsPlugin = require('./albums/index'); 
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

server.ext('onPreResponse', (request, h) => {
  const { response } = request;

  if (response instanceof Error) {
    // ✅ Ganti instanceof ClientError → cek berdasarkan property
    if (response.name === 'ClientError' && response.statusCode) {
      return h.response({
        status: 'fail',
        message: response.message,
      }).code(response.statusCode);
    }

    if (!response.isServer) {
      return h.continue;
    }

    console.error(response);
    return h.response({
      status: 'error',
      message: 'Terjadi kegagalan pada server kami.',
    }).code(500);
  }

  return h.continue;
});

  await server.register({
    plugin: AlbumsPlugin,
    options: {
      service: {},
      validator: {},
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
