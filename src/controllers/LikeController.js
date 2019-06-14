const Post = require("../models/Post");

module.exports = {
  // Salva o item no Mongo
  async save(req, res) {
    const post = await Post.findById(req.params.id);

    post.likes += 1;

    await post.save();

    // Envia o novo like aos usuários via socket.io
    req.io.emit("like", post);

    return res.json(post);
  }
};
