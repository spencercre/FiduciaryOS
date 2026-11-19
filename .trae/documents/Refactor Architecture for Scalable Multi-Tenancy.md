I will proceed with the architectural refactor, starting with securing the current codebase in version control.

## 1. Commit Current Codebase
**Goal:** Create a safe checkpoint before major architectural changes.
- Run `git add .` to stage all modified and untracked files (including the new Login and Landing pages).
- Run `git commit -m "Snapshot: Completed frontend implementation of Landing, Login, and Dashboard pages"` to save the state.

## 2. Implement Service Layer Pattern
**Goal:** Decouple data access from UI components.
- Create `src/services/trustService.js`, `src/services/taskService.js`, and `src/services/emailService.js`.
- Move the data fetching logic (mock data fallback) from `App.jsx` into these services.
- This prepares the app for real multi-tenant data queries (e.g., `getTrusts(orgId)`).

## 3. Introduce React Context Architecture
**Goal:** Eliminate "prop drilling" and centralized state bloat.
- **`AuthContext`**: Encapsulate user authentication, role management, and "Demo Mode" logic.
- **`DataContext`**: Encapsulate global data (Trusts, Tasks, Emails) and expose hooks like `useTrusts()` and `useTasks()`.

## 4. Refactor `App.jsx`
**Goal:** Simplify the main application entry point.
- Remove the large `useState` and `useEffect` blocks.
- Wrap the app with `<AuthProvider>` and `<DataProvider>`.
- Update child components (`Inbox`, `TrustDetail`, etc.) to use the new Context hooks instead of props.

This plan ensures your work is saved first, then systematically improves the architecture to support scalability and multi-tenancy.
