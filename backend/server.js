const app = require("./app");
const http = require("http");
const port=process.env.PORT||8726
const server = http.createServer(app);
server.listen(port);