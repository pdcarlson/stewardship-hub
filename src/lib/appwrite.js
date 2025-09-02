// /src/lib/appwrite.js
import { Client, Databases, Account, ID, Permission, Role, Query, Teams } from 'appwrite';

// --- initialization ---
const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const teams = new Teams(client);

// --- constants ---
const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const SEMESTER_CONFIG_COLLECTION_ID = import.meta.env.VITE_APPWRITE_SEMESTER_CONFIG_ID;
const PURCHASES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PURCHASES_ID;
const SUGGESTIONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_SUGGESTIONS_ID;
const SHOPPING_LIST_COLLECTION_ID = import.meta.env.VITE_APPWRITE_SHOPPING_LIST_ID;

// --- authentication ---
export const logout = () => account.deleteSession('current');
export const getCurrentUser = () => account.get();

export const loginWithGoogle = () => {
  // redirect to the root which will handle routing to the correct dashboard
  const successUrl = `${window.location.origin}/`;
  const failureUrl = `${window.location.origin}/login`;
  
  account.createOAuth2Session('google', successUrl, failureUrl);
};


/**
 * checks if the current user is a member of the 'admin' team.
 * this method directly queries team membership for accuracy.
 * @returns {promise<boolean>}
 */
export const isUserAdmin = async () => {
    try {
        const userTeams = await teams.list();
        return userTeams.teams.some(team => team.name === 'admin');
    } catch (error) {
        console.error("failed to check admin status:", error);
        return false;
    }
};

// --- semester config ---
export const getSemesterConfig = async () => {
    const response = await databases.listDocuments(DB_ID, SEMESTER_CONFIG_COLLECTION_ID);
    return response.documents[0];
};
export const createSemesterConfig = (data) => databases.createDocument(DB_ID, SEMESTER_CONFIG_COLLECTION_ID, ID.unique(), data);
export const updateSemesterConfig = (documentId, data) => databases.updateDocument(DB_ID, SEMESTER_CONFIG_COLLECTION_ID, documentId, data);

// --- purchases ---
export const createPurchase = (purchaseData) => databases.createDocument(DB_ID, PURCHASES_COLLECTION_ID, ID.unique(), purchaseData);
export const getPurchases = (queries = [Query.orderDesc('purchaseDate'), Query.limit(100)]) => databases.listDocuments(DB_ID, PURCHASES_COLLECTION_ID, queries);
export const updatePurchase = (documentId, purchaseData) => databases.updateDocument(DB_ID, PURCHASES_COLLECTION_ID, documentId, purchaseData);
export const deletePurchase = (documentId) => databases.deleteDocument(DB_ID, PURCHASES_COLLECTION_ID, documentId);

// --- suggestions ---
export const createSuggestion = async (itemName, reason) => {
    const user = await account.get();
    const userId = user.$id;
    const permissions = [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
    ];
    const data = { itemName, reason, submittedBy: userId, status: 'Pending' };
    return databases.createDocument(DB_ID, SUGGESTIONS_COLLECTION_ID, ID.unique(), data, permissions);
};

export const getSuggestions = (userId) => {
  const queries = [Query.orderDesc('$createdAt'), Query.limit(100)];
  if (userId) {
    queries.push(Query.equal('submittedBy', userId));
  }
  return databases.listDocuments(DB_ID, SUGGESTIONS_COLLECTION_ID, queries);
};

export const updateSuggestion = (documentId, data) => databases.updateDocument(DB_ID, SUGGESTIONS_COLLECTION_ID, documentId, data);
export const deleteSuggestion = (documentId) => databases.deleteDocument(DB_ID, SUGGESTIONS_COLLECTION_ID, documentId);

// --- shopping list ---
export const getShoppingList = () => databases.listDocuments(DB_ID, SHOPPING_LIST_COLLECTION_ID, [Query.orderDesc('$createdAt'), Query.limit(100)]);

export const addToShoppingList = async (itemName) => {
  const user = await account.get();
  const reportedBy = user.$id;
  return databases.createDocument(
    DB_ID,
    SHOPPING_LIST_COLLECTION_ID,
    ID.unique(),
    { itemName, reportedBy }
  );
};

export const removeFromShoppingList = (documentId) => databases.deleteDocument(DB_ID, SHOPPING_LIST_COLLECTION_ID, documentId);