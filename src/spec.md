# Specification

## Summary
**Goal:** Build a single-page Valentine prompt with a romantic pink/white theme, an evasive “No” button, and a “Yes” success view showing a “Good choice” meme image.

**Planned changes:**
- Create a single-page UI that asks “Will you be my Valentine?” with exactly two buttons: “Yes” and “No”.
- Implement an evasive “No” button that repositions on hover/mouse approach and on touch attempts, staying fully within the viewport and not overlapping the question text or “Yes” button.
- On “Yes” click, replace the prompt/buttons with a celebratory view that displays a meme image containing the exact text “Good choice”.
- Apply cohesive romantic styling using a pink/white color scheme, ensuring clean rendering on iPad Chrome in portrait and landscape.
- Add the required generated meme image as a static asset under `frontend/public/assets/generated/` and reference it directly from the frontend.

**User-visible outcome:** The user sees a Valentine question with “Yes” and an unclickable evasive “No”; clicking “Yes” shows a celebratory meme image that says “Good choice”.
