// Netlify Edge Function: simple shared-password gate with a session cookie.
// Runs on Deno. No npm packages, no build step needed.

const COOKIE_NAME = "site_auth";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours, in seconds

export default async (request, context) => {
  const url = new URL(request.url);

  // Let the logout link work: /logout clears the cookie and sends them back home.
  if (url.pathname === "/logout") {
    return new Response(null, {
      status: 302,
      headers: {
        "Location": "/",
        "Set-Cookie": `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`,
      },
    });
  }

  const password = Netlify.env.get("SITE_PASSWORD");

  // Fail closed: if you forget to set the password in the dashboard, block everything
  // rather than accidentally leaving the site open.
  if (!password) {
    return new Response(
      "Site is not yet configured. Set the SITE_PASSWORD environment variable in Netlify.",
      { status: 503 }
    );
  }

  // Check for an existing valid session cookie.
  const cookies = parseCookies(request.headers.get("cookie") || "");
  if (cookies[COOKIE_NAME] === (await hash(password))) {
    return context.next(); // let the real page through
  }

  // Handle a submitted login form.
  if (request.method === "POST") {
    const form = await request.formData();
    const attempt = form.get("password") || "";

    if (attempt === password) {
      const headers = new Headers({
        "Location": url.pathname === "/logout" ? "/" : url.pathname,
        "Set-Cookie": `${COOKIE_NAME}=${await hash(password)}; Path=/; Max-Age=${COOKIE_MAX_AGE}; HttpOnly; Secure; SameSite=Strict`,
      });
      return new Response(null, { status: 302, headers });
    }

    return new Response(renderForm(true), {
      status: 401,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  // No valid cookie, no form submission yet: show the password page.
  return new Response(renderForm(false), {
    status: 401,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
};

function parseCookies(header) {
  const out = {};
  header.split(";").forEach((pair) => {
    const [k, ...v] = pair.trim().split("=");
    if (k) out[k] = v.join("=");
  });
  return out;
}

async function hash(text) {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function renderForm(showError) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sign in — Study Hub</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Source+Serif+4:wght@400;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #F4EFE4; --bg-raised: #FFFDF8; --ink: #2B2620;
    --ink-soft: #5B5346; --rule: #D8CFBA; --accent: #A8752C;
    --shadow: rgba(43,38,32,0.12);
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #1B1812; --bg-raised: #242019; --ink: #EDE6D6;
      --ink-soft: #B5AA92; --rule: #3A3327; --accent: #E0AC50;
      --shadow: rgba(0,0,0,0.4);
    }
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: var(--bg); color: var(--ink);
    font-family: 'Source Serif 4', Georgia, serif;
  }
  .box {
    background: var(--bg-raised); border: 1px solid var(--rule);
    border-radius: 6px; padding: 34px 32px; width: 100%; max-width: 340px;
    box-shadow: 0 6px 20px var(--shadow);
  }
  h1 {
    font-family: 'Fraunces', serif; font-size: 22px; margin: 0 0 8px;
  }
  p.sub { color: var(--ink-soft); font-size: 14px; margin: 0 0 22px; }
  label {
    font-family: 'IBM Plex Mono', monospace; font-size: 11.5px;
    letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink-soft);
    display: block; margin-bottom: 6px;
  }
  input[type="password"] {
    width: 100%; padding: 10px 12px; font-size: 15px;
    border: 1px solid var(--rule); border-radius: 4px;
    background: var(--bg); color: var(--ink); margin-bottom: 16px;
    font-family: inherit;
  }
  button {
    width: 100%; padding: 11px; border: none; border-radius: 4px;
    background: var(--accent); color: var(--bg-raised); font-size: 15px;
    cursor: pointer; font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.03em;
  }
  button:hover { opacity: 0.9; }
  .error {
    background: #F1D4D0; color: #7A2E22; font-size: 13px;
    padding: 8px 10px; border-radius: 4px; margin-bottom: 16px;
    font-family: 'IBM Plex Mono', monospace;
  }
  @media (prefers-color-scheme: dark) {
    .error { background: #3A2420; color: #E8A79A; }
  }
</style>
</head>
<body>
  <div class="box">
    <h1>Study Hub</h1>
    <p class="sub">This site is private. Enter the password to continue.</p>
    ${showError ? '<div class="error">Wrong password — try again.</div>' : ""}
    <form method="POST">
      <label for="password">Password</label>
      <input type="password" id="password" name="password" autofocus required>
      <button type="submit">Enter</button>
    </form>
  </div>
</body>
</html>`;
}
