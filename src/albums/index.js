// src/albums/index.js
const AlbumsHandler = require('./handler');
const routes = require('./routes');
// const AlbumsService = require('../services/postgres/AlbumsService'); // This line can likely be removed

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { service, validator }) => { // Destructure 'service' from options
    // const albumsService = new AlbumsService(); // REMOVE THIS LINE
    const albumsHandler = new AlbumsHandler(service, validator); // Use the injected 'service'
    server.route(routes(albumsHandler));
  },
};