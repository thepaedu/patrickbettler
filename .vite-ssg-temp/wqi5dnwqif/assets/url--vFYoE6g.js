function withBase(path) {
  if (!path) return path;
  if (/^https?:\/\//.test(path)) return path;
  const base = "/patrickbettler/";
  const trimmedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const trimmedPath = path.startsWith("/") ? path : `/${path}`;
  return `${trimmedBase}${trimmedPath}`;
}
export {
  withBase as w
};
