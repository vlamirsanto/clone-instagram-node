const Post = require("../models/Post");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

module.exports = {
  // Retorna os items no Mongo
  async index(req, res) {
    const posts = await Post.find().sort("-createdAt");

    return res.json(posts);
  },

  // Salva o item no Mongo
  async save(req, res) {
    const { author, place, description, hashtags } = req.body;
    const { filename: image } = req.file;

    const [name] = image.split(".");
    const fileName = `${name}.jpg`;

    // Tratando a imagem
    await sharp(req.file.path)
      .resize(500) // Redimensiona a imagem para 500px de largura ou altura máximos
      .jpeg({ quality: 70 })
      .toFile(path.resolve(req.file.destination, "resized", fileName));

    // Deletando a imagem original
    fs.unlinkSync(req.file.path);

    const post = await Post.create({
      author,
      place,
      description,
      hashtags,
      image: fileName
    });

    // Envia o novo post aos usuários via socket.io
    req.io.emit("post", post);

    return res.json(post);
  }
};
