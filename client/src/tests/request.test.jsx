// src/tests/singleDonation.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SingleDonation from "../components/donation/Donation"; 
import { createMockLocalStorage } from "./test-helpers";

const mockNavigate = jest.fn();

// Mock react-router-dom hooks
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: "donation123" }),
}));

describe("SingleDonation Component", () => {
  const mockDonation = {
    donation: {
      title: "Test Donation",
      category: "Clothes",
      description: "Test description",
      size: "M",
      condition: "New",
      donor: { city: "Toronto", province: "ON" },
      images: ["image1.jpg", "image2.jpg"],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock fetch
    global.fetch = jest.fn();

    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: createMockLocalStorage(),
      writable: true,
    });

    // Mock alert
    window.alert = jest.fn();
  });

  test("renders donation details after fetch", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockDonation,
    });

    render(
      <MemoryRouter>
        <SingleDonation />
      </MemoryRouter>
    );

    // Wait for async fetch to render content
    expect(await screen.findByText("Test Donation")).toBeInTheDocument();
    expect(screen.getByText("Clothes")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
    expect(screen.getByText("Size: M")).toBeInTheDocument();
    expect(screen.getByText("Condition: New")).toBeInTheDocument();
    expect(screen.getByText("Toronto, ON")).toBeInTheDocument();
  });

  test("submits request successfully", async () => {
    window.localStorage.setItem("token", "test-token");

    // First fetch for donation details, second for handleRequest
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockDonation,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Request submitted successfully!" }),
      });

    render(
      <MemoryRouter>
        <SingleDonation />
      </MemoryRouter>
    );

    const btn = await screen.findByText(/Request This Item/i);
    fireEvent.click(btn);

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith(
        "Request submitted successfully!"
      )
    );

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/request",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer test-token",
        }),
        body: JSON.stringify({ donationId: "donation123" }),
      })
    );
  });

  test("shows error message if request fails", async () => {
    window.localStorage.setItem("token", "test-token");

    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockDonation }) // fetch donation
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: "Already requested" }),
      }); // request fails

    render(
      <MemoryRouter>
        <SingleDonation />
      </MemoryRouter>
    );

    const btn = await screen.findByText(/Request This Item/i);
    fireEvent.click(btn);

    await waitFor(() =>
      expect(screen.getByText(/Already requested/i)).toBeInTheDocument()
    );
  });

  test("redirects to login if no token", async () => {
    window.localStorage.clear();

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockDonation,
    });

    render(
      <MemoryRouter>
        <SingleDonation />
      </MemoryRouter>
    );

    const btn = await screen.findByText(/Request This Item/i);
    fireEvent.click(btn);

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/login"));
  });
});
