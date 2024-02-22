import jwt from "jsonwebtoken";

export const handleWsConnection = async (socket, req) => {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];

  if (!token) {
    socket.close();
    return;
  }

  try {
    const user = await jwt.verify(token, process.env.TOKEN_SECRET);
    console.log(user);
    socket.on('message', (message) => {
    });
  }
  catch (e) {
    socket.close();
  }
}