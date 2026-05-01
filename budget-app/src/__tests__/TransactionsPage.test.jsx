/**
 * Test cases: 4.7.3.1 - 4.7.3.2
 * TransactionsPage component tests.
 */
import { render, screen, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import TransactionsPage from "../pages/TransactionsPage";

vi.mock("../api", () => ({
  api: {
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock Sidebar to avoid routing/nav complexity in tests
vi.mock("../../components/landing/Sidebar", () => ({
  default: () => <div data-testid="sidebar" />,
}));

import { api } from "../api";

const mockOnNavigate = vi.fn();

describe("TransactionsPage", () => {

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage user
    localStorage.setItem("user", JSON.stringify({ display_name: "Test User" }));
  });

  // ── 4.7.3.1 ──────────────────────────────────────────────────────────────
  it("shows loading state while API call is in progress", () => {
    // Never resolves — simulates pending state
    api.get.mockReturnValue(new Promise(() => {}));

    render(<TransactionsPage onNavigate={mockOnNavigate} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  // ── 4.7.3.2 ──────────────────────────────────────────────────────────────
  it("shows empty state when no transactions are returned", async () => {
    api.get.mockImplementation((url) => {
      if (url.includes("/api/transactions")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            transactions: [],
            total: 0,
            page: 1,
            pages: 0,
          }),
        });
      }
      if (url.includes("/api/categories")) {
        return Promise.resolve({
          ok: true,
          json: async () => ([]),
        });
      }
    });

    render(<TransactionsPage onNavigate={mockOnNavigate} />);

    await waitFor(() => {
      expect(screen.getByText("No transactions found.")).toBeInTheDocument();
    });
  });

});
