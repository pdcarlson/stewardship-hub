/src
|-- /components
|   |-- /auth
|   |   |-- LoginForm.jsx         # handles user login form submission and state.
|   |   |-- SignUpForm.jsx        # handles new user registration.
|   |-- /budget
|   |   |-- BudgetDisplay.jsx     # displays high-level budget stats (spent, remaining, projection).
|   |   |-- PurchaseForm.jsx      # a modal form for admins to add or edit a purchase.
|   |   |-- PurchaseHistory.jsx   # renders a table or list of all purchases with sorting/filtering.
|   |-- /suggestions
|   |   |-- SuggestionForm.jsx    # a simple form for members to submit new item suggestions.
|   |   |-- SuggestionList.jsx    # lists suggestions; shows all for admins, only user's own for members.
|   |-- /inventory
|   |   |-- ConsumptionLogger.jsx # a quick-entry form to log the usage of an inventory item.
|   |   |-- InventoryReport.jsx   # displays a report of weekly consumption averages for key items.
|   |-- /ui
|       |-- Button.jsx            # reusable, styled button component.
|       |-- Input.jsx             # reusable, styled input field.
|       |-- Card.jsx              # reusable container with box-shadow and padding.
|       |-- Modal.jsx             # reusable modal dialog component.
|-- /pages
|   |-- AdminDashboard.jsx        # the main view for the 'admin' role, containing all admin-facing components.
|   |-- MemberDashboard.jsx       # the main view for the 'member' role, focused on suggestions.
|   |-- LoginPage.jsx             # contains the LoginForm and SignUpForm, handles auth routing.
|   |-- Layout.jsx                # main application layout with header, sidebar, and content area.
|-- /lib
|   |-- appwrite.js               # initializes and exports appwrite services for auth, db, etc.
|   |-- calculations.js           # houses pure functions for business logic (budget, consumption).
|-- /hooks
|   |-- useAuth.js                # custom hook to provide auth state and user data throughout the app.
|-- App.jsx                       # top-level component, defines routes for pages.
|-- main.jsx                      # entry point of the react application.
