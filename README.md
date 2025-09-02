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
-   **Dynamic Budget Tracking**: Provides a real-time overview of the semester's finances, including total budget, amount spent, amount remaining, and a visual progress bar.
-   **Intelligent Spending Projection**: Projects total semester spending by analyzing the historical average weekly cost of recurring items.
-   **Usage Reporting & Projection Control**: Displays a report of the average weekly purchase count and cost for each recurring item. The admin can manually deactivate or reactivate items to include or exclude them from budget projections.
-   **Purchase Management (CRUD)**: The admin can create, read, update, and delete itemized purchases. A bulk import feature allows for pasting receipt text for quick logging.
-   **Shopping List**: Automatically populated when members report an item out of stock or when an admin approves a member suggestion.

### 3. Member Dashboard
-   **View Stocked Items**: Members can view and search a list of all currently stocked recurring items.
-   **Report Out of Stock**: Members can report an item as out of stock, which adds it to the admin's shopping list.
-   **Submit & Manage Suggestions**: Members can submit new item suggestions and view the status (`Pending`, `Approved`, `Declined`) and any admin feedback on their past suggestions.

---

## Backend Setup (Appwrite)

The backend is powered by Appwrite, a backend-as-a-service platform that handles authentication and the database.

### Authentication
-   **Provider**: Utilizes Appwrite's built-in Email/Password authentication.
-   **Admin Role**: Admin privileges are managed by adding a user to a specific **Team** within the Appwrite console named `admin`.

### Database Schema

The database consists of four collections to organize the application's data.

#### 1. `semesterConfig`
-   **Description**: Stores the primary budget settings for the current semester. It is designed to hold only a single document.
-   **Permissions**: Read: `Any`, Write: `Team:admin`

| Key | Type | Required | Notes |
| :--- | :--- | :--- | :--- |
| `semesterName`| String | Yes | e.g., "Fall 2025" |
| `startDate` | Datetime | Yes | The start date of the semester budget period |
| `endDate` | Datetime | Yes | The end date of the semester budget period |
| `brothersOnMealPlan` | Integer | Yes | Number of members on the meal plan |
| `mealPlanCost` | Float | Yes | Cost per brother for the semester |
| `carryoverBalance` | Float | Yes | Initial balance from the previous semester |
| `additionalRevenue` | Float | Yes | Money from fines, alumni donations, etc. |


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
| `purchaseFrequency` | String | Yes | `once` | e.g., `once`, `recurring` |
| `isActiveForProjection` | Boolean | Yes | `true` | Determines if the item is used in budget projections. |
| `isStockItem` | Boolean | Yes | `true` | Controls if the item appears on the member dashboard. |


#### 3. `suggestions`
-   **Description**: Stores shopping list items submitted by members.
-   **Permissions**: Create: `Any Authenticated User`, Read/Update/Delete: `Team:admin`. (Document-level permissions grant R/U/D access to the creator).

| Key | Type | Required | Default | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `itemName` | String | Yes | | |
| `reason` | String | No | | A brief justification for the suggestion |
| `submittedBy`| String | Yes | | The Appwrite User ID of the member |
| `status` | String | Yes | `Pending` | Can be `Pending`, `Approved`, or `Declined`. |
| `adminResponse`| String | No | | An optional response from the admin |

#### 4. `shoppingList`
-   **Description**: A list of items reported as out of stock by members or approved from suggestions.
-   **Permissions**: Create: `Any Authenticated User`, Read/Delete: `Team:admin`.

| Key | Type | Required | Notes |
| :--- | :--- | :--- | :--- |
| `itemName` | String | Yes | The name of the item. |
| `reportedBy`| String | Yes | The Appwrite User ID of the member who reported it. |

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
    -   Create a database and the collections detailed in the **Database Schema** section above.
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

- [ ] Google OAuth Integration