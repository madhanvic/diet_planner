import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import "@testing-library/jest-dom/vitest";

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

(globalThis as typeof globalThis).ResizeObserver = ResizeObserver;
