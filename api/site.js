const { verifyJwt, parseCookies } = require("./_jwt");
const { SITE_HTML } = require("./_site-html");

module.exports = function handler(req, res) {
  const cookies = parseCookies(req);
  const token = cookies["bb_session"];
  const payload = verifyJwt(token, process.env.SESSION_SECRET || "fallback");

  if (!payload || !payload.hasAccess) {
    res.status(401).send("Unauthorized");
    return;
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.send(SITE_HTML);
};
