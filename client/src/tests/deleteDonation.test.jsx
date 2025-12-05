import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

const mockNavigate = jest.fn();

function DeleteButton({ id }) {
  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const res = await fetch(`/api/donation/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      mockNavigate('/donations/my-donations');
    }
  };

  return <button onClick={handleDelete}>Delete</button>;
}

describe('Delete donation flow', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    const store = {};
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((k) => store[k] || null),
        setItem: jest.fn((k, v) => { store[k] = v; }),
        clear: jest.fn(() => { for (const k in store) delete store[k]; }),
      }
    });
    mockNavigate.mockClear();
  });

  afterEach(() => jest.clearAllMocks());

  test('calls DELETE and navigates on success', async () => {
    localStorage.setItem('token', 'token-123');

    global.fetch.mockResolvedValueOnce({ ok: true });

    render(<DeleteButton id="abc123" />);

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('/api/donation/abc123', expect.objectContaining({ method: 'DELETE' })));

    expect(mockNavigate).toHaveBeenCalledWith('/donations/my-donations');
  });
});
