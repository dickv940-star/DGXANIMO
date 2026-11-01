# Original Product Preservation

## Non-negotiable rules

1. Keep the uploaded source file immutable. Never overwrite the original asset.
2. Store adjustments as parameters, not destructive edits to the source.
3. AI segmentation may propose a foreground mask only. It must not synthesize or redraw product pixels.
4. Background replacement must operate behind the protected product layer.
5. Do not automatically remove marks, scratches, labels, serials, text, or texture from the product surface.
6. Any future surface retouch must be opt-in, localized, reversible, and visibly reviewable.
7. Keep a before/after comparison and a one-action reset to the original.

## Planned image document model

- Original asset: immutable file reference and source dimensions.
- Adjustment stack: ordered, reversible parameters.
- Foreground mask: editable segmentation result with confidence metadata.
- Background layer: preset or user-provided image.
- Shadow layer: separate compositing layer.
- Export: render a new file; never mutate the source.

## Validation strategy

- Unit-test adjustment defaults and filter generation.
- Verify reset returns to neutral adjustments.
- Verify original asset reference is unchanged after edits.
- Add image-diff regression tests before introducing AI segmentation or compositing.
- Compare protected foreground pixels against the source wherever no explicitly approved adjustment is enabled.

## Important limitation

A segmentation model can make mistakes at edges. The mask must be editable and must never be treated as proof that product pixels are safe to alter. Product-surface cleanup remains disabled by default.
