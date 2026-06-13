import { Router } from "express";
import { logger } from "../lib/logger";
import { SITE_HTML } from "../site-html";

const router = Router();

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const GUILD_ID = process.env.DISCORD_GUILD_ID;
const ROLE_ID = process.env.DISCORD_ROLE_ID;

if (!CLIENT_ID || !CLIENT_SECRET || !GUILD_ID || !ROLE_ID) {
  throw new Error(
    "Missing required Discord environment variables: DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_GUILD_ID, DISCORD_ROLE_ID",
  );
}

function getRedirectUri(req: any): string {
  const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost";
  const proto = req.headers["x-forwarded-proto"] || "https";
  return `${proto}://${host}/api/auth/callback`;
}

router.get("/auth/discord", (req, res) => {
  const redirectUri = getRedirectUri(req);
  const params = new URLSearchParams({
    client_id: CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "identify guilds.members.read",
  });
  res.redirect(`https://discord.com/oauth2/authorize?${params.toString()}`);
});

router.get("/auth/callback", async (req, res) => {
  const { code } = req.query as { code?: string };

  if (!code) {
    res.redirect("/?error=missing_code");
    return;
  }

  try {
    const redirectUri = getRedirectUri(req);

    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: CLIENT_ID!,
        client_secret: CLIENT_SECRET!,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenRes.ok) {
      const body = await tokenRes.text();
      logger.error({ status: tokenRes.status, body }, "Discord token exchange failed");
      res.redirect("/?error=auth_failed");
      return;
    }

    const tokenData = (await tokenRes.json()) as { access_token: string };
    const accessToken = tokenData.access_token;

    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userRes.ok) {
      logger.error({ status: userRes.status }, "Discord user fetch failed");
      res.redirect("/?error=auth_failed");
      return;
    }

    const user = (await userRes.json()) as {
      id: string;
      username: string;
      global_name: string | null;
      avatar: string | null;
    };

    const memberRes = await fetch(
      `https://discord.com/api/users/@me/guilds/${GUILD_ID}/member`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    if (!memberRes.ok) {
      logger.warn({ status: memberRes.status, userId: user.id }, "Guild member fetch failed — user not in server");
      req.session.userId = user.id;
      req.session.username = user.global_name || user.username;
      req.session.avatar = user.avatar;
      req.session.hasAccess = false;
      req.session.save(() => res.redirect("/?error=no_access"));
      return;
    }

    const member = (await memberRes.json()) as { roles: string[] };
    const hasAccess = member.roles.includes(ROLE_ID!);

    req.session.userId = user.id;
    req.session.username = user.global_name || user.username;
    req.session.avatar = user.avatar;
    req.session.hasAccess = hasAccess;

    req.session.save(() => {
      if (hasAccess) {
        res.redirect("/");
      } else {
        res.redirect("/?error=no_access");
      }
    });
  } catch (err) {
    logger.error({ err }, "Auth callback error");
    res.redirect("/?error=auth_failed");
  }
});

router.get("/auth/me", (req, res) => {
  if (!req.session.userId || !req.session.hasAccess) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  res.json({
    userId: req.session.userId,
    username: req.session.username,
    avatar: req.session.avatar ?? null,
  });
});

router.post("/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

router.get("/site", (req, res) => {
  if (!req.session.userId || !req.session.hasAccess) {
    res.status(401).send("Unauthorized");
    return;
  }
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.send(SITE_HTML);
});

export default router;
