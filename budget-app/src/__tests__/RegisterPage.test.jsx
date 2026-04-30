/**
 * Test cases: 4.7.2.1
 * RegisterPage component tests.
 */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import RegisterPage from "../pages/RegisterPage";

vi.mock("../api", () => ({
  api: {
    post: vi.fn(),
  },
}));

import { api } from "../api";

const mockOnBack = vi.fn();
const mockOnSuccess = vi.fn();

describe("RegisterPage", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── 4.7.2.1 ──────────────────────────────────────────────────────────────
  it("shows error when passwords do not match without calling API", async () => {
    render(
      <RegisterPage onBack={mockOnBack} onSuccess={mockOnSuccess} />
    );

    fireEvent.change(screen.getByPlaceholderText("John Doe"), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByPlaceholderText("name@gmail.com"), {
      target: { value: "test@test.com" },
    });

    const passwordFields = screen.getAllByPlaceholderText("••••••••");
    fireEvent.change(passwordFields[0], { target: { value: "Test123!" } });
    fireEvent.change(passwordFields[1], { target: { value: "Different1!" } });

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
    });

    expect(api.post).not.toHaveBeenCalled();
  });

});
