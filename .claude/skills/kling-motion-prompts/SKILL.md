---
name: kling-motion-prompts
description: Write a Kling AI motion prompt to animate a still image into a looped video (hero backgrounds, subtle motion). Use whenever the user wants a still animated or a video hero generated.
---

# Motion / video prompts (Kling AI)

Same pattern as image prompts: write the prompt for the user, don't ask them to.

The user uploads an image to Kling. You write the **motion prompt** with:

- **One motion only** per prompt (multiple motions confuse the model)
- Duration: 5 seconds, looped
- Camera move described in plain words (slow push-in, gentle pan-right, subtle parallax)
- "Make it loop" explicitly stated

For more ambitious shots (scene morph, start frame + end frame), tell the user about Kling's "Image-to-Video with End Frame" feature and have them generate a second image to use as the end frame. Then you stitch the clips together inside the project — no external editor needed.
