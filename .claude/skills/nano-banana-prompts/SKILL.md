---
name: nano-banana-prompts
description: Write a complete Nano Banana 2 (Google AI Studio) image-generation prompt from the user's casual one-line brief — for hero images, illustrations, or any visual asset. Use whenever the user wants an image generated.
---

# Visual generation prompts (Nano Banana 2 / Google AI Studio)

When the user wants a hero image, an illustration, or any visual asset, **don't ask them to write the prompt themselves**. Write it for them.

The user gives a casual brief in one line ("a perfume bottle floating mid-air, soft blurred background"). Take that and expand it into a complete prompt with:

- **Subject** — what's the focal object
- **Lighting** — direction, hardness, color temperature
- **Mood** — cinematic, editorial, gritty, soft
- **Composition** — rule of thirds, centered, off-center, depth of field
- **Aspect ratio** — 16:9 for hero, 1:1 for square, 9:16 for mobile-vertical
- **Style cues** — "cinematic film still", "editorial photography", "matte 3D render"

Hand the user the full prompt. They paste it into Google AI Studio with Nano Banana 2 selected and generate 3–4 variations.

**Settings vs prompt** — important. Aspect ratio and resolution are controlled by the **right-side panel** in Google AI Studio, not by the prompt. Always remind the user to:

1. Set the **aspect ratio** in the right-side panel (16:9 hero, 1:1 square, 9:16 vertical) to match the prompt
2. Bump **resolution to 4K** for premium output (the default is lower)

Keep the aspect ratio in the prompt too — it's a hint the model honors better when reinforced — but the selector is what actually controls the output dimensions.
