I will modify the SSO (Google, Microsoft, Apple) workflow in `GetStarted.jsx` to match the "bit-by-bit" experience of the email flow, rather than skipping straight to the app.

### Changes to `src/pages/GetStarted.jsx`

1.  **Update `handleSso` function**:
    *   Remove the immediate `localStorage` save and `navigate('/app')` call.
    *   Instead, update the `signup` state to record the selected `provider` (e.g., 'google').
    *   Advance the `step` to `'name'`.
    *   *Result:* Clicking a social button will now transition smoothly to the "What is your name?" screen, entering the existing profile-building flow.

2.  **Update `handleComplete` function**:
    *   Modify the final submission logic to use the actual `signup.provider` (Google/MS/Apple) instead of hardcoding `'email'`.

3.  **Update State Initialization**:
    *   Ensure the `signup` state object includes a `provider` field (defaulting to `'email'` or `null`) to track the method used.

This approach preserves the "jarring" authentication shortcut (skipping password creation) while enforcing the "bit-by-bit" data capture (Name → Company → Org Size) that you like.