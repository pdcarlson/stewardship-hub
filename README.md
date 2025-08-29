# Fraternity Stewardship Hub

A web application designed to help a fraternity steward manage the semester budget, track itemized purchases, and handle member suggestions for groceries and other house items.

## Overview

This project replaces the traditional spreadsheet-based method of budget and inventory tracking with a modern, role-based web application. The "Steward" (an admin user) can manage the semester's budget, log all purchases, and view member suggestions. Regular members can log in to submit and manage their own suggestions for the house.

## Tech Stack

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Appwrite](https://img.shields.io/badge/Appwrite-F02E65?style=for-the-badge&logo=appwrite&logoColor=white)

---

## Core Features

### 1. User Authentication & Roles
-   **Account Management**: Users can sign up for an account and log in.
-   **Role-Based Access Control**: The application supports two distinct user roles:
    -   `admin`: The steward, who has full access to budget management, purchase logging, and can view all member suggestions.
    -   `member`: A regular fraternity brother who can submit and manage their own suggestions.

### 2. Admin Dashboard
-   **Dynamic Budget Tracking**: The admin dashboard provides a real-time overview of the semester's finances, including:
    -   Total Semester Budget
    -   Total Amount Spent
    -   Total Amount Remaining
-   **Spending Projection**: A linear projection of the total semester spending is calculated based on the current average weekly spending, helping the steward to forecast and adjust.
-   **Purchase Logging (CRUD)**: The admin can create, read, update, and delete itemized purchases.

### 3. Member Suggestions (Partially Implemented)
-   **Create Suggestions**: Members can create suggestions for items to be purchased.
-   **Manage Own Suggestions**: Members can only view, edit, or delete the suggestions they have personally submitted.
-   **Admin View**: The admin has read-only access to all suggestions submitted by all members.

### 4. Inventory & Consumption Tracking (Planned)
-   A system to log the consumption of key grocery items (e.g., "Gallons of Milk," "Loaves of Bread").
-   The goal is to calculate the average weekly consumption of each item to better predict future purchasing needs.

---

## Backend Setup (Appwrite)

The backend is powered by Appwrite, a backend-as-a-service platform that handles authentication and the database.

### Authentication
-   **Provider**: Utilizes Appwrite's built-in Email/Password authentication.
-   **Admin Role**: Admin privileges are managed by adding a user to a specific **Team** within the Appwrite console named `admin`. The application code checks if a logged-in user is a member of this team to grant them admin access.

### Database Schema

The database consists of five collections to organize the application's data.

#### 1. `semesterConfig`
-   **Description**: Stores the primary budget settings for the current semester. It is designed to hold only a single document.
-   **Permissions**: Read: `Any`, Write: `Team:admin`

| Key | Type | Required | Notes |
| :--- | :--- | :--- | :--- |
| `totalBudget` | Float | Yes | e.g., `10000.00` |
| `startDate` | Datetime | Yes | The start date of the semester budget period |
| `endDate` | Datetime | Yes | The end date of the semester budget period |
| `semesterName`| String | Yes | e.g., "Fall 2025" |

#### 2. `purchases`
-   **Description**: Logs all itemized purchases made by the steward.
-   **Permissions**: Read: `Any Authenticated User`, Write: `Team:admin`

| Key | Type | Required | Default | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `itemName` | String | Yes | | |
| `cost` | Float | Yes | | |
| `quantity` | Integer | Yes | `1` | |
| `purchaseDate`| Datetime | Yes | | |
| `category` | String | Yes | `Meal Plan` | Used to categorize expenses |

#### 3. `suggestions`
-   **Description**: Stores shopping list items submitted by members.
-   **Permissions**: Create: `Any Authenticated User`, Read: `Team:admin`. (Document-level permissions grant R/U/D access to the creator).

| Key | Type | Required | Notes |
| :--- | :--- | :--- | :--- |
| `itemName` | String | Yes | |
| `reason` | String | No | A brief justification for the suggestion |
| `submittedBy`| String | Yes | The Appwrite User ID of the member |

#### 4. `inventoryItems` (Planned)
-   **Description**: A master list of distinct, trackable inventory items.
-   **Permissions**: Read: `Any Authenticated User`, Write: `Team:admin`

| Key | Type | Required | Notes |
| :--- | :--- | :--- | :--- |
| `name` | String | Yes | e.g., "Milk" |
| `unit` | String | Yes | e.g., "Gallon", "Loaf" |

#### 5. `consumptionLog` (Planned)
-   **Description**: Records each instance of an inventory item being consumed.
-   **Permissions**: Create: `Any Authenticated User`, Read/Update/Delete: `Team:admin`

| Key | Type | Required | Notes |
| :--- | :--- | :--- | :--- |
| `itemId` | String | Yes | A foreign key relation to the `inventoryItems` collection |
| `quantityUsed`| Float | Yes | |
| `logDate` | Datetime | Yes | |

---

## Getting Started

Follow these instructions to get the project running locally for development.

### Prerequisites
-   Node.js (v18 or later)
-   npm
-   An Appwrite Cloud account or a self-hosted Appwrite instance.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [your-repository-url]
    cd stewardship-hub
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Appwrite:**
    -   Create a new project in your Appwrite console.
    -   Add a **Web App** platform, using `localhost` as the hostname for local development.
    -   Create a database and the five collections detailed in the **Database Schema** section above.
    -   Enable the **Email/Password** authentication provider.
    -   Create a **Team** with the name `admin`.

4.  **Set up environment variables:**
    -   Make a copy of the `.env.example` file and rename it to `.env`.
    -   Fill in the `.env` file with your project's credentials from the Appwrite console settings.

5.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application should now be running on `http://localhost:5173`.

## Future Roadmap

-   [ ] Implement the full UI for the **Member Dashboard**, including creating, viewing, and deleting suggestions.
-   [ ] Build the UI for the **Inventory Tracking** feature, allowing users to log consumption of items.
-   [ ] Create an **Inventory Report** page for the admin to view weekly consumption statistics.
-   [ ] Add editing and deleting functionality for purchases on the Admin Dashboard.
-   [ ] Implement user profile management features.