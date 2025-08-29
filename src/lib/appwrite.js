// /src/lib/appwrite.js
import { Client, Databases, Account, ID, Permission, Role, Query } from 'appwrite';

// --- initialization ---
// it's best practice to initialize the client and services once and export them.
const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) // your appwrite endpoint
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID); // your project id

export const account = new Account(client);
export const databases = new Databases(client);

// --- constants ---
// using constants for ids makes the code easier to maintain.
const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const SEMESTER_CONFIG_COLLECTION_ID = import.meta.env.VITE_APPWRITE_SEMESTER_CONFIG_ID;
const PURCHASES_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PURCHASES_ID;
const SUGGESTIONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_SUGGESTIONS_ID;
const INVENTORY_ITEMS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_INVENTORY_ITEMS_ID;
const CONSUMPTION_LOG_COLLECTION_ID = import.meta.env.VITE_APPWRITE_CONSUMPTION_LOG_ID;

// --- authentication ---

/**
 * creates a new user account.
 * @param {string} email 
 * @param {string} password 
 * @param {string} name 
 * @returns {Promise<import('appwrite').Models.User<import('appwrite').Models.Preferences>>}
 */
export const createAccount = (email, password, name) => {
  return account.create(ID.unique(), email, password, name);
};

/**
 * creates a new session for a user (logs them in).
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<import('appwrite').Models.Session>}
 */
export const login = (email, password) => {
  return account.createEmailPasswordSession(email, password);
};

/**
 * deletes the current user session (logs them out).
 * @returns {Promise<void>}
 */
export const logout = () => {
  return account.deleteSession('current');
};

/**
 * gets the currently logged-in user's data.
 * @returns {Promise<import('appwrite').Models.User<import('appwrite').Models.Preferences>>}
 */
export const getCurrentUser = () => {
  return account.get();
};

/**
 * checks if the current user has the 'admin' label.
 * assumes roles are stored in user labels.
 * @returns {Promise<boolean>}
 */
export const isUserAdmin = async () => {
    try {
        const user = await getCurrentUser();
        return user.labels.includes('admin');
    } catch (error) {
        return false; // if no user is logged in, they are not an admin.
    }
};


// --- semester config ---

/**
 * retrieves the semester configuration document.
 * assumes there is only one document in this collection.
 * @returns {Promise<import('appwrite').Models.Document>}
 */
export const getSemesterConfig = async () => {
    const response = await databases.listDocuments(DB_ID, SEMESTER_CONFIG_COLLECTION_ID);
    return response.documents[0]; // return the first (and only) document
};

/**
 * updates the semester configuration document. (admin only)
 * @param {string} documentId - the id of the config document.
 * @param {object} data - the data to update, e.g., { totalBudget, startDate, endDate }.
 * @returns {Promise<import('appwrite').Models.Document>}
 */
export const updateSemesterConfig = (documentId, data) => {
    return databases.updateDocument(DB_ID, SEMESTER_CONFIG_COLLECTION_ID, documentId, data);
};


// --- purchases ---

/**
 * creates a new purchase document. (admin only)
 * @param {object} purchaseData - e.g., { itemName, cost, quantity, purchaseDate, category }.
 * @returns {Promise<import('appwrite').Models.Document>}
 */
export const createPurchase = (purchaseData) => {
    return databases.createDocument(
        DB_ID,
        PURCHASES_COLLECTION_ID,
        ID.unique(),
        purchaseData
    );
};

/**
 * retrieves a list of all purchases.
 * @param {string[]} queries - optional appwrite queries for sorting, filtering, etc.
 * @returns {Promise<import('appwrite').Models.DocumentList<import('appwrite').Models.Document>>}
 */
export const getPurchases = (queries = [Query.orderDesc('purchaseDate')]) => {
    return databases.listDocuments(DB_ID, PURCHASES_COLLECTION_ID, queries);
};

/**
 * updates an existing purchase document. (admin only)
 * @param {string} documentId 
 * @param {object} purchaseData 
 * @returns {Promise<import('appwrite').Models.Document>}
 */
export const updatePurchase = (documentId, purchaseData) => {
    return databases.updateDocument(DB_ID, PURCHASES_COLLECTION_ID, documentId, purchaseData);
};

/**
 * deletes a purchase document. (admin only)
 * @param {string} documentId 
 * @returns {Promise<void>}
 */
export const deletePurchase = (documentId) => {
    return databases.deleteDocument(DB_ID, PURCHASES_COLLECTION_ID, documentId);
};


// --- suggestions ---

/**
 * creates a new suggestion with user-specific permissions.
 * @param {string} itemName 
 * @param {string} reason 
 * @returns {Promise<import('appwrite').Models.Document>}
 */
export const createSuggestion = async (itemName, reason) => {
    const user = await account.get();
    const userId = user.$id;

    const permissions = [
        Permission.read(Role.team('admin')),
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
    ];

    return databases.createDocument(
        DB_ID,
        SUGGESTIONS_COLLECTION_ID,
        ID.unique(),
        { itemName, reason, submittedBy: userId },
        permissions
    );
};

/**
 * retrieves suggestions. the query will determine what is fetched.
 * from the frontend, admins can fetch all, while members can fetch their own.
 * @param {string[]} queries 
 * @returns {Promise<import('appwrite').Models.DocumentList<import('appwrite').Models.Document>>}
 */
export const getSuggestions = (queries = [Query.orderDesc('$createdAt')]) => {
    return databases.listDocuments(DB_ID, SUGGESTIONS_COLLECTION_ID, queries);
};

/**
 * updates a suggestion. permissions are handled by appwrite.
 * @param {string} documentId 
 * @param {object} data - { itemName, reason }.
 * @returns {Promise<import('appwrite').Models.Document>}
 */
export const updateSuggestion = (documentId, data) => {
    return databases.updateDocument(DB_ID, SUGGESTIONS_COLLECTION_ID, documentId, data);
};

/**
 * deletes a suggestion. permissions are handled by appwrite.
 * @param {string} documentId 
 * @returns {Promise<void>}
 */
export const deleteSuggestion = (documentId) => {
    return databases.deleteDocument(DB_ID, SUGGESTIONS_COLLECTION_ID, documentId);
};


// --- inventory items ---

/**
 * retrieves all defined inventory items.
 * @returns {Promise<import('appwrite').Models.DocumentList<import('appwrite').Models.Document>>}
 */
export const getInventoryItems = () => {
    return databases.listDocuments(DB_ID, INVENTORY_ITEMS_COLLECTION_ID, [Query.orderAsc('name')]);
};

/**
 * creates a new trackable inventory item. (admin only)
 * @param {object} itemData - { name, unit }.
 * @returns {Promise<import('appwrite').Models.Document>}
 */
export const createInventoryItem = (itemData) => {
    return databases.createDocument(DB_ID, INVENTORY_ITEMS_COLLECTION_ID, ID.unique(), itemData);
};


// --- consumption log ---

/**
 * creates a new consumption log entry.
 * @param {object} logData - { itemId, quantityUsed, logDate }.
 * @returns {Promise<import('appwrite').Models.Document>}
 */
export const logConsumption = (logData) => {
    return databases.createDocument(DB_ID, CONSUMPTION_LOG_COLLECTION_ID, ID.unique(), logData);
};

/**
 * retrieves consumption logs.
 * @param {string[]} queries - typically will be filtered by 'itemId'.
 * @returns {Promise<import('appwrite').Models.DocumentList<import('appwrite').Models.Document>>}
 */
export const getConsumptionLogs = (queries = [Query.orderDesc('logDate')]) => {
    return databases.listDocuments(DB_ID, CONSUMPTION_LOG_COLLECTION_ID, queries);
};