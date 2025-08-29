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
const INVENTORY_ITEMS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_INVENTORY_ITEMS_ID;
const CONSUMPTION_LOG_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CONSUMPTION_LOG_ID;

// --- authentication ---
export const createAccount = (email, password, name) => account.create(ID.unique(), email, password, name);
export const login = (email, password) => account.createEmailPasswordSession(email, password);
export const logout = () => account.deleteSession('current');
export const getCurrentUser = () => account.get();

/**
 * checks if the current user is a member of the 'admin' team.
 * this method directly queries team membership for accuracy.
 * @returns {promise<boolean>}
 */
export const isUserAdmin = async () => {
    try {
        const userTeams = await teams.list(); // get all teams the user is in
        // for debugging, you can see what this returns
        console.log('user teams from appwrite:', userTeams); 
        // check if any of the user's teams is named 'admin'
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
export const updateSemesterConfig = (documentId, data) => databases.updateDocument(DB_ID, SEMESTER_CONFIG_COLLECTION_ID, documentId, data);

// --- purchases ---
export const createPurchase = (purchaseData) => databases.createDocument(DB_ID, PURCHASES_COLLECTION_ID, ID.unique(), purchaseData);
export const getPurchases = (queries = [Query.orderDesc('purchaseDate')]) => databases.listDocuments(DB_ID, PURCHASES_COLLECTION_ID, queries);
export const updatePurchase = (documentId, purchaseData) => databases.updateDocument(DB_ID, PURCHASES_COLLECTION_ID, documentId, purchaseData);
export const deletePurchase = (documentId) => databases.deleteDocument(DB_ID, PURCHASES_COLLECTION_ID, documentId);

// --- suggestions ---
export const createSuggestion = async (itemName, reason) => {
    const user = await account.get();
    const userId = user.$id;
    const permissions = [
        Permission.read(Role.team('admin')),
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
    ];
    return databases.createDocument(DB_ID, SUGGESTIONS_COLLECTION_ID, ID.unique(), { itemName, reason, submittedBy: userId }, permissions);
};
export const getSuggestions = (queries = [Query.orderDesc('$createdAt')]) => databases.listDocuments(DB_ID, SUGGESTIONS_COLLECTION_ID, queries);
export const updateSuggestion = (documentId, data) => databases.updateDocument(DB_ID, SUGGESTIONS_COLLECTION_ID, documentId, data);
export const deleteSuggestion = (documentId) => databases.deleteDocument(DB_ID, SUGGESTIONS_COLLECTION_ID, documentId);

// --- inventory items ---
export const getInventoryItems = () => databases.listDocuments(DB_ID, INVENTORY_ITEMS_COLLECTION_ID, [Query.orderAsc('name')]);
export const createInventoryItem = (itemData) => databases.createDocument(DB_ID, INVENTORY_ITEMS_COLLECTION_ID, ID.unique(), itemData);

// --- consumption log ---
export const logConsumption = (logData) => databases.createDocument(DB_ID, CONSUMPTION_LOG_COLLECTION_ID, ID.unique(), logData);
export const getConsumptionLogs = (queries = [Query.orderDesc('logDate')]) => databases.listDocuments(DB_ID, CONSUMPTION_LOG_COLLECTION_ID, queries);