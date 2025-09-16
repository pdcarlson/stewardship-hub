// /functions/approveVerificationRequest-nyc/src/main.js
const sdk = require('node-appwrite');

module.exports = async ({ req, res, log, error }) => {
  const requiredVars = [
    'APPWRITE_API_KEY',
    'MEMBERS_TEAM_ID',
    'APPWRITE_DATABASE_ID',
    'REQUESTS_COLLECTION_ID',
  ];

  for (const v of requiredVars) {
    if (!process.env[v]) {
      error(`environment variable ${v} is not set.`);
      return res.json({ ok: false, message: `server is missing required configuration: ${v}` }, 500);
    }
  }
  
  const client = new sdk.Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT ?? 'https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const teams = new sdk.Teams(client);
  const databases = new sdk.Databases(client);
  
  if (!req.bodyRaw) {
    error("payload is empty.");
    return res.json({ ok: false, message: "payload is empty." }, 400);
  }
  
  const payload = JSON.parse(req.bodyRaw);
  const { userId, requestId, userEmail } = payload;
  
  if (!userId || !requestId || !userEmail) {
    error("userid, useremail, and requestid are required.");
    return res.json({ ok: false, message: "userId, userEmail, and requestId are required." }, 400);
  }

  try {
    await teams.createMembership(
      process.env.MEMBERS_TEAM_ID,
      ['member'],
      userEmail,
      userId
    );
    await databases.updateDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.REQUESTS_COLLECTION_ID,
      requestId,
      { status: 'approved' }
    );
    return res.json({ ok: true, message: "user has been approved and added to the team." });

  } catch (e) {
    error(e.message);
    return res.json({ ok: false, message: "an error occurred.", error: e.message }, 500);
  }
};