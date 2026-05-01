/**
 * Test cases: 4.7.1.1 - 4.7.1.2
 * LoginPage component tests.
 */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import LoginPage from "../pages/LoginPage";

// Mock the api module
vi.mock("../api", () => ({
  api: {
    post: vi.fn(),
  },
}));

import { api } from "../api";

const mockOnBack = vi.fn();
const mockOnSuccess = vi.fn();
const mockOnNavigate = vi.fn();

describe("LoginPage", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── 4.7.1.1 ──────────────────────────────────────────────────────────────
  it("renders email and password fields and login button", () => {
    render(
      <LoginPage
        onBack={mockOnBack}
        onSuccess={mockOnSuccess}
        onNavigate={mockOnNavigate}
      />
    );

    expect(screen.getByPlaceholderText("name@gmail.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  // ── 4.7.1.2 ──────────────────────────────────────────────────────────────
  it("shows error message when API returns 401", async () => {
    api.post.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Invalid email or password" }),
    });

    render(
      <LoginPage
        onBack={mockOnBack}
        onSuccess={mockOnSuccess}
        onNavigate={mockOnNavigate}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("name@gmail.com"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "WrongPass1!" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

});
