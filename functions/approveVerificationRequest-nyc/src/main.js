// /functions/approveVerificationRequest/src/main.js
const sdk = require('node-appwrite');

module.exports = async ({ req, res, log, error }) => {
  // appwrite's older runtimes had a different signature.
  // this function is updated to use the modern 'node-18.0' runtime context.

  // check for required custom environment variables from the appwrite console
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
  
  // initialize the appwrite sdk
  const client = new sdk.Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT ?? 'https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const teams = new sdk.Teams(client);
  const databases = new sdk.Databases(client);
  
  // get the data passed from the client.
  // in modern runtimes, the raw string body is in req.bodyraw.
  if (!req.bodyRaw) {
    error("payload is empty.");
    return res.json({ ok: false, message: "payload is empty." }, 400);
  }
  
  const payload = JSON.parse(req.bodyRaw);
  const { userId, requestId, userEmail } = payload;
  
  if (!userId || !requestId || !userEmail) {
    error("userId, useremail, and requestid are required.");
    return res.json({ ok: false, message: "userId, userEmail, and requestId are required." }, 400);
  }

  try {
    log(`approving request for user: ${userId}`);

    // 1. add the user to the 'members' team
    await teams.createMembership(
      process.env.MEMBERS_TEAM_ID,
      ['member'], // roles
      userEmail,
      userId
    );
    log(`user ${userId} added to team ${process.env.MEMBERS_TEAM_ID}.`);

    // 2. update the status of the verification request document to 'approved'
    await databases.updateDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.REQUESTS_COLLECTION_ID,
      requestId,
      { status: 'approved' }
    );
    log(`request document ${requestId} status updated to 'approved'.`);

    // 3. send a success response
    return res.json({ ok: true, message: "user has been approved and added to the team." });

  } catch (e) {
    error(e.message);
    return res.json({ ok: false, message: "an error occurred.", error: e.message }, 500);
  }
};