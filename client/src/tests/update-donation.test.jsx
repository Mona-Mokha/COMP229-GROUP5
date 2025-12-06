// src/tests/myDonationsEdit.test.jsx
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import MyDonations from '../components/donation/MyDonations';

const mockNavigate = jest.fn();

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('MyDonations Edit button', () => {
  const mockDonations = [
    {
      id: 'don1',
      title: 'Jacket',
      description: 'Warm jacket',
      preference: 'Men',
      category: 'Clothes',
      size: 'M',
      condition: 'New',
      images: ['image1.jpg'],
      status: 'Available',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ donations: mockDonations }),
    });

    const store = { token: 'token-123' };
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key) => store[key] || null),
      },
    });
  });

  test('navigates to edit page when Edit button is clicked', async () => {
    render(<MyDonations />);
    
    const editBtn = await screen.findByText('Edit');
    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/donations/submit/don1');
    });
  });
});
