I have researched the HubSpot design patterns and confirmed the current state of the codebase. I will assume the roles of **UI Designer** and **Front End Architect** to execute this plan.

### **Phase 1: Front End Architecture (The Architect)**
*   **Routing Strategy**:
    *   Refactor `App.jsx` to support a public-facing marketing side and a private application side.
    *   **`/` (Root)**: The new Marketing Landing Page.
    *   **`/login`**: The dedicated Login Portal.
    *   **`/dashboard`**: The existing Fiduciary OS (protected route).
*   **Auth State**:
    *   Implement a lightweight `AuthProvider` context to manage the session (simulated for the prototype).

### **Phase 2: The "HubSpot-Style" Header (The UI Designer)**
*   **Visual Hierarchy**: I will implement the specific button hierarchy you requested, modeled after HubSpot:
    1.  **"Log In"**: (Tertiary) Text link or subtle ghost button. Top right.
    2.  **"Get a Demo"**: (Secondary) High-visibility outlined button.
    3.  **"Get Started Free"**: (Primary) Solid, high-contrast action button (using our Brand Gold or Action Green).
*   **Implementation**:
    *   Create `LandingPage.jsx` with this persistent header.
    *   **Template Container**: Since the specific "Gemini" file is missing from the codebase, I will build the **Hero Section** structure with a clear placeholder comment (`{/* PASTE GEMINI TEMPLATE HERE */}`) so you can easily drop in your content.

### **Phase 3: The Login Experience**
*   **Design**: A clean, split-screen or centered "Glassmorphism" card design that feels "Fiduciary-Grade" (secure, professional).
*   **Logic**:
    *   **Username**: `demo`
    *   **Password**: `demo`
    *   **Success**: Redirects user to the `/dashboard`.

### **Execution Steps**
1.  **Refactor**: Modify `App.jsx` and `main.jsx` for the new routing structure.
2.  **Build**: Create `LandingPage.jsx` with the HubSpot header.
3.  **Build**: Create `Login.jsx` with the "demo" logic.
4.  **Verify**: Ensure the flow `Landing -> Login -> Dashboard` works seamlessly.
