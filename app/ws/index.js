import jwt from "jsonwebtoken";
import * as url from "url";

const channels = {};
const NOTIFICATION = "notification";
const channelTypes = [NOTIFICATION];

/**
 * send data to user
 * @param channelType
 * @param userId
 * @param data
 */
function send(channelType, userId, data) {
  channels[channelType + userId]?.forEach(client => {
    client.send(JSON.stringify(data));
  })
}

export const wsManager = {
  send,
  sendNotification (userId, data) {
    send(NOTIFICATION, userId, data)
  }
}

/**
 * Handle client connection to websocket server
 * @param socket
 * @param req
 * @returns {Promise<void>}
 */
export const handleWsConnection = async (socket, req) => {
  const token = url.parse(req.url, true).query.token;
  const channelType = req.headers["action"] ?? NOTIFICATION;

  // only connected user is allowed
  if (!token) {
    socket.send("401: Unauthorized");
    socket.close();
    return;
  }

  try {
    if(channelTypes.indexOf(channelType) < 0) throw new Error();
    // verify if user is connected
    const user = await jwt.verify(token, process.env.TOKEN_SECRET);
    socket.channelType = channelType;
    socket.user = user;
    // join channel
    joinChannel(socket);
    socket.on('close', onSocketClose(socket))
  }
  catch (e) {
    socket.send("403: Access denied");
    socket.close();
  }
}

/**
 * clearTimeout if still valid and close socket.
 * Remove socket from the channel
 * @param socket
 * @returns {(function(): void)|*}
 */
function onSocketClose(socket) {
  return () => {
    if(socket.timeOutId) {
      clearTimeout(socket.timeOutId);
    }
    const channel = channels[socket.channelType + socket.user._id];
    const index = channel.indexOf(socket);
    channel.splice(index, 1);
  }
}

/**
 * Make socket join channel.
 * On token expiration close token.
 * @param socket
 */
function joinChannel(socket) {
  let channel = channels[socket.channelType + socket.user._id];
  if (!channel) {
    channel = [];
    channels[socket.channelType + socket.user._id] = channel;
  }
  // auto close connection after expiration if user did not
  socket.timeOutId = setTimeout(() => {
    socket.timeOutId = false;
    socket.close()
  }, new Date(socket.user.exp * 1000) - new Date().getTime());
  channel.push(socket);
}