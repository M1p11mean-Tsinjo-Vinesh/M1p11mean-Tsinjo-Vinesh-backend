import jwt from "jsonwebtoken";

export function authenticateToken(allowedRoles, except = []) {
  return (req, res, next) => {
    if (except.indexOf(req.method) >= 0) {
      next();
      return;
    }

    const header = req.headers["authorization"];
    const token = header && header.split(" ")[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (user === undefined) {
        return res.sendStatus(401);
      }
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      if (!allowedRoles.includes(user.role)) return res.sendStatus(403);
      next();
    });
  };
}
