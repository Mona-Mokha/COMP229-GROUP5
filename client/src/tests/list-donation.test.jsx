// src/tests/browseDonations.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BrowseDonations from "../components/donation/BrowseDonations";
import { createMockLocalStorage } from "./test-helpers";

const mockNavigate = jest.fn();

// Mock react-router-dom hooks
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

describe("BrowseDonations Component", () => {
  const mockDonations = [
    {
      id: "don1",
      title: "Jacket",
      category: "Clothes",
      size: "M",
      condition: "New",
      images: ["image1.jpg"],
      donor: { name: "Alice", city: "Toronto", province: "ON" },
    },
    {
      id: "don2",
      title: "Book",
      category: "Education",
      size: "N/A",
      condition: "Used",
      images: [],
      donor: { name: "Bob", city: "Vancouver", province: "BC" },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock fetch
    global.fetch = jest.fn();

    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: createMockLocalStorage(),
      writable: true,
    });
  });

  test("renders donations after fetch", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ donations: mockDonations }),
    });

    render(<BrowseDonations />);

    // Wait for donations to render
    expect(await screen.findByText("Jacket")).toBeInTheDocument();
    expect(screen.getByText("Clothes")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Toronto, ON")).toBeInTheDocument();

    expect(screen.getByText("Book")).toBeInTheDocument();
    expect(screen.getByText("Education")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Vancouver, BC")).toBeInTheDocument();
  });

  test("handles donations with empty images gracefully", async () => {
    const donationsWithNoImages = [
      {
        id: "don3",
        title: "Lamp",
        category: "Home",
        size: "Small",
        condition: "New",
        images: [],
        donor: { name: "Charlie", city: "Montreal", province: "QC" },
      },
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ donations: donationsWithNoImages }),
    });

    render(<BrowseDonations />);

    expect(await screen.findByText("Lamp")).toBeInTheDocument();
    const img = screen.getByAltText("Lamp");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", ""); // fallback for empty images
  });

  test("clicking View Details navigates to donation page", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ donations: mockDonations }),
    });

    render(<BrowseDonations />);

    const btns = await screen.findAllByText(/View Details/i);
    fireEvent.click(btns[0]);

    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith(`/donation/don1`)
    );

    fireEvent.click(btns[1]);
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith(`/donation/don2`)
    );
  });

  test("handles fetch failure gracefully", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Failed to fetch" }),
    });

    render(<BrowseDonations />);

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith("/api/donation", expect.any(Object))
    );

    // Ensure error is logged
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
