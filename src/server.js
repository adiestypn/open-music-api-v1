require('dotenv').config();

const Hapi = require('@hapi/hapi');

// Plugins
const AlbumsPlugin = require('./albums/index');
const SongsPlugin = require('./songs');

// Services (untuk database)
const AlbumsService = require('./services/postgres/AlbumsService'); 
const SongsService = require('./services/postgres/SongsService');   

// Validators
const AlbumValidator = require('./validator/albums'); 
const SongsValidator = require('./validator/songs');

// Exceptions
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    //process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) { // Lebih baik cek instance dari ClientError langsung
        return h.response({
          status: 'fail',
          message: response.message,
        }).code(response.statusCode);
      }

      if (!response.isServer) {
        return h.continue;
      }

      console.error(response); // Log server error
      return h.response({
        status: 'error',
        message: 'Terjadi kegagalan pada server kami.',
      }).code(500);
    }

    return h.continue;
  });

  await server.register([
    {
      plugin: AlbumsPlugin,
      options: {
        service: albumsService,
        validator: AlbumValidator, 
      },
    },
    {
      plugin: SongsPlugin,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();