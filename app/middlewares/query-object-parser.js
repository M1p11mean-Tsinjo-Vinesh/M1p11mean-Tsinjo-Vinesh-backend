export const queryObjectParser = (req, res, next) => {
  const obj = req.query;
  const newQuery = {}
  Object.keys(obj).forEach(key => {
    const keys = key.split(".");
    const containers = [newQuery];
    for (let i = 0; i < keys.length; i++) {
      const value = i === (keys.length - 1) ? obj[key] : containers[i][keys[i]] || {};
      containers[i][keys[i]] = value;
      containers.push(value);
    }
  })
  req.query = newQuery;
  next()
}