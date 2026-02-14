# Specification

## Summary
**Goal:** Add an Edit panel beneath the generated creative preview, expand flash overlay controls, and provide a placeholder “Edit” flow that returns an edited output without external image-editing services.

**Planned changes:**
- Add an “Edit” section directly under the generated creative preview with a multiline instructions text area and an “Edit” button, with instruction text persisted within Studio state (including across refresh when state persistence exists).
- Extend flash overlay controls to include user-configurable color, size, position, and animation speed, and wire these settings into the flash overlay rendering so regenerated previews reflect the updated controls.
- Implement a placeholder async “Edit” button workflow that uses the current generated image + instruction text, shows a loading/disabled state while running, and produces a separate “edited” image result that can be downloaded (without calling any external AI/LLM services).

**User-visible outcome:** After generating a creative, users can adjust flash overlay properties (including color/size/position/speed), enter free-text edit instructions under the preview, and click “Edit” to run a simulated edit process that outputs a downloadable edited result.
