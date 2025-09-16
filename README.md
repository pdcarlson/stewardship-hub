# Fraternity Stewardship Hub

A web application designed to help a fraternity steward manage the semester budget, track itemized purchases, and handle member suggestions for groceries and other house items.

## Overview

This project replaces the traditional spreadsheet-based method of budget and inventory tracking with a modern, role-based web application. It features a public-facing, interactive demo for showcasing the application's features, and a secure, members-only area for live data management.

The "Steward" (an admin user) can manage the semester's budget, log all purchases, and approve or deny access requests from new users. Verified members can log in to view stocked items, report items as out-of-stock, and submit their own suggestions for the house.

## Tech Stack

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Appwrite](https://img.shields.io/badge/Appwrite-F02E65?style=for-the-badge&logo=appwrite&logoColor=white)

---

## Core Features

### 1. Public Demo Mode
-   **Interactive Showcase**: The application's root URL features a public-facing demo with hardcoded, interactive data.
-   **Role Toggling**: Visitors can switch between a demo of the "Admin" and "Member" dashboards to explore the full range of UI features without accessing any real data.
-   **Clear Login Path**: The demo includes a prominent "Member Login" button for authenticated users to access the live application.

### 2. User Authentication & Verification
-   **Google OAuth**: Users sign in exclusively through their Google accounts for enhanced security and simplicity.
-   **Secure Verification Workflow**: New users who sign in are placed in a "pending verification" state. They must request access and be manually approved by an admin before they can access any of the application's live data.
-   **Role-Based Access Control**: The application supports two distinct user roles for verified members:
    -   `admin`: The steward, who has full access to budget management, purchase logging, and can approve new members.
    -   `member`: A regular fraternity brother who can view inventory and manage their own suggestions.

### 3. Admin Dashboard
-   **Verification Request Management**: Admins are notified of pending access requests via a modal that appears upon login. They can approve or deny requests directly from their dashboard.
-   **Dynamic Budget Tracking**: Provides a real-time overview of the semester's finances, with a toggle to hide monetary values for privacy.
-   **Intelligent Spending Projection**: Projects total semester spending by analyzing the historical average weekly cost of recurring items.
-   **Purchase Management (CRUD)**: The admin can create, read, update, and delete itemized purchases, with a bulk import feature for quickly logging receipts.
-   **Quick Inventory Management**: Admins can view and search all stocked items and report them as out-of-stock directly from their dashboard.

### 4. Member Dashboard
-   **View Stocked Items**: Verified members can view and search a list of all currently stocked recurring items.
-   **Report Out of Stock**: Members can report an item as out of stock, which adds it to the admin's shopping list.
-   **Submit & Manage Suggestions**: Members can submit new item suggestions and view the status and any admin feedback on their past suggestions.

---

## Backend Setup (Appwrite)

The backend is powered by Appwrite, which handles authentication, the database, and serverless functions.

### Authentication & Authorization
-   **Provider**: Utilizes Appwrite's built-in Google OAuth2 provider.
-   **Teams**: User authorization is managed through two Appwrite teams:
    -   `admin`: Users in this team have full administrative privileges.
    -   `members`: Users must be in this team to access any of the application's live data. Users are added to this team by an admin via the verification system.

### Appwrite Functions
The application uses a serverless Appwrite Function to securely handle the user verification process.
-   **`approveVerificationRequest`**: A Node.js function that is triggered by an admin from the frontend. It performs two critical, server-side actions:
    1.  Adds the approved user to the `members` team.
    2.  Updates the status of the user's verification request document to "approved."

### Database Schema

The database consists of five collections to organize the application's data.

#### 1. `semesterConfig`
-   **Description**: Stores the primary budget settings for the current semester.
-   **Permissions**: Read: `team:members`, Write: `team:admin`

| Key | Type | Required |
| :--- | :--- | :--- |
| `semesterName`| String | Yes |
| `startDate` | Datetime | Yes |
| `endDate` | Datetime | Yes |
| `brothersOnMealPlan` | Integer | Yes |
| `mealPlanCost` | Float | Yes |
| `carryoverBalance` | Float | Yes |
| `additionalRevenue` | Float | Yes |

#### 2. `purchases`
-   **Description**: Logs all itemized purchases made by the steward.
-   **Permissions**: Read: `team:members`, Write: `team:admin`

| Key | Type | Required | Default |
| :--- | :--- | :--- | :--- |
| `itemName` | String | Yes | |
| `cost` | Float | Yes | |
| `quantity` | Integer | Yes | `1` |
| `purchaseDate`| Datetime | Yes | |
| `category` | String | Yes | `Meal Plan` |
| `purchaseFrequency` | String | Yes | `once` |
| `isActiveForProjection` | Boolean | Yes | `true` |
| `isStockItem` | Boolean | Yes | `true` |

#### 3. `suggestions`
-   **Description**: Stores shopping list items submitted by members.
-   **Permissions**: Create: `team:members`, Read/Update/Delete: `team:admin`. (Document-level permissions grant R/U/D access to the creator).

| Key | Type | Required | Default |
| :--- | :--- | :--- | :--- |
| `itemName` | String | Yes | |
| `reason` | String | No | |
| `submittedBy`| String | Yes | |
| `status` | String | Yes | `Pending` |
| `adminResponse`| String | No | |

#### 4. `shoppingList`
-   **Description**: A list of items reported as out of stock or approved from suggestions.
-   **Permissions**: Create: `team:members`, Read/Delete: `team:admin`.

| Key | Type | Required |
| :--- | :--- | :--- |
| `itemName` | String | Yes |
| `reportedBy`| String | Yes |

#### 5. `verificationRequests`
-   **Description**: Stores access requests from new, unverified users.
-   **Permissions**: Create: `role:member` (any authenticated user), Read/Update/Delete: `team:admin`.

| Key | Type | Required |
| :--- | :--- | :--- |
| `userId` | String | Yes |
| `userName` | String | Yes |
| `email` | String | Yes |
| `status` | String | Yes |

---

## Project Architecture

The project follows a structured pattern to separate concerns.
-   **`src/components`**: Contains reusable UI components used throughout the application (e.g., `Card`, `Button`, `Modal`).
-   **`src/pages`**: Contains the main page components. The `AdminDashboard` and `MemberDashboard` are "presentational" components that receive data via props.
-   **`src/containers`**: Contains "container" components that handle the data fetching and business logic for the live, authenticated dashboards. They wrap the presentational page components.
-   **`src/context`**: Manages global state, such as authentication status.
-   **`src/lib`**: Contains helper modules, such as the Appwrite client, dummy data, and calculation functions.
-   **`appwrite/functions`**: Contains the source code for server-side Appwrite Functions.

---

## Getting Started

### Prerequisites
-   Node.js (v18 or later)
-   npm
-   The Appwrite CLI
-   An Appwrite Cloud account or a self-hosted Appwrite instance.
-   A Google Cloud Platform account for setting up OAuth.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/pdcarlson/stewardship-hub.git](https://github.com/pdcarlson/stewardship-hub.git)
    cd stewardship-hub
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    -   Create a file named `.env` in the root of the project.
    -   Add the following variables, replacing the placeholder values with your Appwrite project credentials:
    ```
    VITE_APPWRITE_ENDPOINT="https://<region>.cloud.appwrite.io/v1"
    VITE_APPWRITE_PROJECT_ID="YOUR_PROJECT_ID"
    VITE_APPWRITE_DATABASE_ID="YOUR_DATABASE_ID"
    VITE_APPWRITE_SEMESTER_CONFIG_ID="YOUR_SEMESTER_CONFIG_COLLECTION_ID"
    VITE_APPWRITE_PURCHASES_ID="YOUR_PURCHASES_COLLECTION_ID"
    VITE_APPWRITE_SUGGESTIONS_ID="YOUR_SUGGESTIONS_COLLECTION_ID"
    VITE_APPWRITE_SHOPPING_LIST_ID="YOUR_SHOPPING_LIST_COLLECTION_ID"
    VITE_APPWRITE_REQUESTS_COLLECTION_ID="YOUR_REQUESTS_COLLECTION_ID"
    VITE_APPWRITE_ADMIN_TEAM_ID="YOUR_ADMIN_TEAM_ID"
    VITE_APPWRITE_MEMBERS_TEAM_ID="YOUR_MEMBERS_TEAM_ID"
    VITE_APPWRITE_APPROVE_FUNCTION_ID="YOUR_APPROVE_FUNCTION_ID"
    ```

4.  **Set up Appwrite & Google OAuth:**
    -   Create a new project in your Appwrite console and add a **Web App** platform for `localhost`.
    -   Create a new database and the five collections with their respective attributes and permissions as detailed in the **Database Schema** section.
    -   Set up Google OAuth credentials and add them to the Appwrite Google provider.
    -   Create two **Teams** in Appwrite: `admin` and `members`. Add your admin user to both teams.
    -   Create and deploy the `approveVerificationRequest` function as described in the **Appwrite Functions** section.

5.  **Run the development server:**
    ```bash
    npm run dev
    ```