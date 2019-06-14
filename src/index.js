const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();

const server = require("http").Server(app);
const io = require("socket.io")(server);

mongoose.connect(
  "mongodb+srv://instagra:instagra@cluster0-qtwxf.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

// Socket.io para todas as rotas e controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

/**
 * Rota para acessar arquivos estáticos
 * localhost:3333/files/NOME_DO_ARQUIVO
 */
app.use(
  "/files",
  express.static(path.resolve(__dirname, "..", "uploads", "resized"))
);

app.use(cors());
app.use(require("./routes"));

server.listen(3333);
