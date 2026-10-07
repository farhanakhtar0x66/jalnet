import { latLngToCell } from "h3-js";
import { describe, expect, it } from "vitest";
import { coveringCells, viewportCells } from "../packages/geo/src/coverage.js";

describe("H3 candidate coverage", () => {
  it("includes neighboring points and viewport edges", () => {
    const point = { lat: 28.6139, lon: 77.209 };
    const cells = coveringCells(point, 300);
    expect(cells).toContain(latLngToCell(28.6139, 77.2115, 8));
    const viewport = viewportCells([77.205, 28.61, 77.215, 28.62]);
    for (const [lat, lon] of [
      [28.61, 77.205],
      [28.62, 77.215],
      [28.615, 77.21],
    ])
      expect(viewport).toContain(latLngToCell(lat ?? 0, lon ?? 0, 8));
  });
  it("rejects requests over the cell cap and reversed bounds", () => {
    expect(() => coveringCells({ lat: 28.6, lon: 77.2 }, 50000)).toThrow();
    expect(() => viewportCells([77.2, 28.6, 78.2, 29.6])).toThrow();
    expect(() => viewportCells([77.2, 28.6, 77.1, 28.7])).toThrow();
  });
});
