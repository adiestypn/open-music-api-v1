// adiestypn/open-music-api-v1/open-music-api-v1-c960353ba1a3a781368d93ca721334e24ff20683/src/songs/index.js

const SongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'songs',
  version: '1.0.0',
  register: async (server, { service, validator }) => { // Terima 'service' dari options
    // HAPUS BARIS INI: const songsService = new AlbumsService();
    // Seharusnya service (yang merupakan instance dari SongsService) sudah di-pass dari server.js

    const songsHandler = new SongsHandler(service, validator); // Gunakan 'service' yang di-pass
    server.route(routes(songsHandler));
  },
};