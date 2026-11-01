import { describe, expect, it } from "vitest";
import { adjustmentFilter, canReplaceOriginalSource, DEFAULT_ADJUSTMENTS } from "./document";

describe("Original Product Preservation foundation", () => {
  it("starts with neutral adjustments", () => {
    expect(DEFAULT_ADJUSTMENTS).toEqual({
      exposure: 0, brightness: 100, contrast: 100, saturation: 100, warmth: 0
    });
  });

  it("keeps the original source immutable by design", () => {
    expect(canReplaceOriginalSource()).toBe(false);
  });

  it("creates a deterministic CSS filter string from adjustment values", () => {
    expect(adjustmentFilter(DEFAULT_ADJUSTMENTS)).toBe("brightness(100%) contrast(100%) saturate(100%) sepia(0)");
  });
});