export default function handler(req, res) {
  const client_id = process.env.OAUTH_CLIENT_ID;
  
  if (!client_id) {
    return res.status(500).send('OAUTH_CLIENT_ID is not configured in Vercel environment variables.');
  }

  // Removing redirect_uri relies on the GitHub OAuth app configuration. 
  // This prevents redirect_uri mismatch errors when testing on Vercel preview URLs.
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=repo,user`;
  
  res.redirect(302, githubAuthUrl);
}
