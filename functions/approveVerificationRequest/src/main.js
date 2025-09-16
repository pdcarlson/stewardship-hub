// src/main.js
const sdk = require('node-appwrite');

module.exports = async function (req, res) {
  const client = new sdk.Client();
  const teams = new sdk.Teams(client);
  const databases = new sdk.Databases(client);

  // you can get these variables from your function's settings page
  if (
    !req.variables['APPWRITE_FUNCTION_ENDPOINT'] ||
    !req.variables['APPWRITE_FUNCTION_API_KEY'] ||
    !req.variables['APPWRITE_FUNCTION_PROJECT_ID']
  ) {
    console.warn("environment variables are not set. function cannot use appwrite sdk.");
    return res.json({ ok: false, message: "environment variables are not set." }, 500);
  }

  client
    .setEndpoint(req.variables['APPWRITE_FUNCTION_ENDPOINT'])
    .setProject(req.variables['APPWRITE_FUNCTION_PROJECT_ID'])
    .setKey(req.variables['APPWRITE_FUNCTION_API_KEY']);

  // get the data passed from the client
  const payload = JSON.parse(req.payload);
  const { userId, requestId, userEmail } = payload;
  
  if (!userId || !requestId || !userEmail) {
    return res.json({ ok: false, message: "userId, userEmail, and requestId are required." }, 400);
  }

  // get the members team id from variables
  const membersTeamId = req.variables['MEMBERS_TEAM_ID'];
  if (!membersTeamId) {
    return res.json({ ok: false, message: "members_team_id variable is not set." }, 500);
  }

  try {
    // 1. add the user to the 'members' team
    await teams.createMembership(
      membersTeamId,
      ['member'], // roles
      userEmail,
      userId
    );

    // 2. update the status of the verification request document to 'approved'
    const dbId = req.variables['APPWRITE_DATABASE_ID'];
    const collectionId = req.variables['REQUESTS_COLLECTION_ID'];
    
    await databases.updateDocument(
      dbId,
      collectionId,
      requestId,
      { status: 'approved' }
    );

    // 3. send a success response
    res.json({ ok: true, message: "user has been approved and added to the team." });

  } catch (error) {
    console.error(error);
    res.json({ ok: false, message: "an error occurred.", error: error.message }, 500);
  }
};