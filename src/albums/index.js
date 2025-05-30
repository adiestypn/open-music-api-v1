const AlbumsHandler = require('./handler');
const routes = require('./routes');
const AlbumsService = require('../services/postgres/AlbumsService'); // Asumsi path

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { validator }) => { // Service option dari server.js belum dipakai di sini
    const albumsService = new AlbumsService();
    const albumsHandler = new AlbumsHandler(albumsService, validator); // Berikan service ke handler
    server.route(routes(albumsHandler));
  },
};