const { nanoid } = require('nanoid');
const ClientError = require('../exceptions/ClientError');
const albums = [];

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  addAlbumHandler(request, h) {
    const { name, year } = request.payload;

    if (typeof name !== 'string' || name.trim() === '') {
      throw new ClientError('Gagal menambahkan album. Mohon isi nama album', 400);
    }

    if (typeof year !== 'number') {
      throw new ClientError('Gagal menambahkan album. Mohon isi tahun album dengan benar (angka)', 400);
    }

    const id = `album-${nanoid(16)}`;
    albums.push({ id, name, year });

    return h.response({
      status: 'success',
      data: { albumId: id },
    }).code(201);
  }

  getAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const album = albums.find((a) => a.id === id);

    if (!album) {
      throw new ClientError('Album tidak ditemukan', 404);
    }

    return {
      status: 'success',
      data: { album },
    };
  }

  editAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const { name, year } = request.payload;

    if (typeof name !== 'string' || name.trim() === '') {
      throw new ClientError('Gagal memperbarui album. Mohon isi nama album', 400);
    }

    if (typeof year !== 'number') {
      throw new ClientError('Gagal memperbarui album. Mohon isi tahun album dengan benar (angka)', 400);
    }

    const index = albums.findIndex((album) => album.id === id);
    if (index === -1) {
      throw new ClientError('Gagal memperbarui album. Id tidak ditemukan', 404);
    }

    albums[index] = { ...albums[index], name, year };

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  deleteAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const index = albums.findIndex((album) => album.id === id);

    if (index === -1) {
      throw new ClientError('Album gagal dihapus. Id tidak ditemukan', 404);
    }

    albums.splice(index, 1);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }
}

module.exports = AlbumsHandler;
