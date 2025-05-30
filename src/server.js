require('dotenv').config();

const Hapi = require('@hapi/hapi');
const AlbumsPlugin = require('./albums/index');
const ClientError = require('./exceptions/ClientError');
const SongsPlugin = require('./songs'); // <- kalau belum ada, comment dulu
const SongsValidator = require('./validator/songs'); // <- kalau belum ada, comment dulu

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
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

  // ✅ Daftar plugin di sini
  await server.register({
    plugin: AlbumsPlugin,
    options: {
      service: {},       // <- nanti diganti service beneran
      validator: {},     // <- nanti ganti juga
    },
  });

  await server.register({
    plugin: SongsPlugin,
    options: {
      validator: SongsValidator,
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
