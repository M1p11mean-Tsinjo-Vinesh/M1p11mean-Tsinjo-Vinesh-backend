import jwt from "jsonwebtoken";

export function authenticateToken(allowedRoles) {
  return (req, res, next) => {
    const header = req.headers["authorization"];
    const token = header && header.split(" ")[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      if (!allowedRoles.includes(user.role)) return res.sendStatus(403);
      next();
    });
  };
}
