const { nanoid } = require('nanoid');
const ClientError = require('../exceptions/ClientError');

const songs = [];

class SongsHandler {
  constructor(_, validator) {
    this._validator = validator;
  }

  addSongHandler = (request, h) => {
    this._validator.validateSongPayload(request.payload);

    const { title, year, genre, performer, duration, albumId } = request.payload;
    const id = `song-${nanoid(16)}`;

    songs.push({ id, title, year, genre, performer, duration, albumId });

    return h.response({
      status: 'success',
      data: { songId: id },
    }).code(201);
  };

  getSongsHandler = () => {
    const result = songs.map(({ id, title, performer }) => ({ id, title, performer }));
    return {
      status: 'success',
      data: { songs: result },
    };
  };

  getSongByIdHandler = (request, h) => {
    const { id } = request.params;
    const song = songs.find((s) => s.id === id);

    if (!song) {
      throw new ClientError('Lagu tidak ditemukan', 404);
    }

    return {
      status: 'success',
      data: { song },
    };
  };

  editSongByIdHandler = (request, h) => {
    this._validator.validateSongPayload(request.payload);
    const { id } = request.params;
    const { title, year, genre, performer, duration, albumId } = request.payload;

    const index = songs.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new ClientError('Gagal memperbarui lagu. Id tidak ditemukan', 404);
    }

    songs[index] = { ...songs[index], title, year, genre, performer, duration, albumId };

    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui',
    };
  };

  deleteSongByIdHandler = (request, h) => {
    const { id } = request.params;
    const index = songs.findIndex((s) => s.id === id);

    if (index === -1) {
      throw new ClientError('Lagu gagal dihapus. Id tidak ditemukan', 404);
    }

    songs.splice(index, 1);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  };
}

module.exports = SongsHandler;
