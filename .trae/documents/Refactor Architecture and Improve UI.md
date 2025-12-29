I will improve the architecture and UI of the Fiduciary Operating System by refactoring the monolithic `App.jsx` into a modular, component-based structure using React Router for navigation and Tailwind CSS for styling.

### 1. Project Restructuring
- Create a standard React project structure:
  - `src/components/`: Reusable UI components.
  - `src/layouts/`: Layout components (Sidebar, MainLayout).
  - `src/pages/`: Page components for each major section.
  - `src/data/`: Mock data and constants.
  - `src/services/`: Firebase and API services.
  - `src/context/`: Global state management.

### 2. Data Extraction
- Move all mock data (`TRUSTS`, `TASKS`, `VENDORS`, `DOCUMENTS`, etc.) from `App.jsx` to `src/data/mockData.js` to clean up the code and make it reusable.

### 3. Component Extraction & Refactoring
- **Base Components**: Extract `PrivilegeToggle`, `DocViewer` into their own files in `src/components/`.
- **Feature Components**: Extract `TaskCommandCenter` and its sub-components (`TaskCard`, `NewTaskModal`) into `src/components/tasks/`.
- **Navigation**: Create a new `Sidebar` component with improved styling and `Header` component for the top bar.

### 4. Routing Implementation
- Install `react-router-dom`.
- Create a `MainLayout` that includes the `Sidebar` and `Header`.
- Create separate pages:
  - `Dashboard` (Overview)
  - `Trusts` (Trust Management)
  - `Tasks` (Task Command Center)
  - `Documents` (Document Vault)
  - `Inbox` (Communication Triage)
- Configure `react-router-dom` in `App.jsx` to route between these pages.

### 5. UI/UX Improvements
- **Theme**: Enforce the "Racing Green" and "Stone" color palette consistently using Tailwind.
- **Typography**: Ensure proper font usage (Serif for formal elements, Sans for UI).
- **Layout**: Implement a responsive grid layout for the dashboard.
- **Interactivity**: Improve hover states and transitions for better user feedback.

### 6. Verification
- Verify that all features (Task moving, Document viewing, Filtering) still work after refactoring.
- Ensure the application builds and runs without errors.
