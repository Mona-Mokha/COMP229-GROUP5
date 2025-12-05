import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Signup from '../components/Signup'; // make sure the path & capitalization are correct
import { createMockLocalStorage } from './test-helpers';

const mockNavigate = jest.fn();

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => { store[key] = value; }),
    clear: jest.fn(() => { store = {}; }),
    removeItem: jest.fn((key) => { delete store[key]; }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Signup', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    mockNavigate.mockClear();
    localStorageMock.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('lets the user fill in the form fields', () => {
    render(<Signup />);

    const nameInput = screen.getByPlaceholderText(/John Doe/i);
    const emailInput = screen.getByPlaceholderText(/name@example.com/i);
    const passwordInput = screen.getByPlaceholderText(/Min. 6 characters/i);

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@test.com' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });

    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@test.com');
    expect(passwordInput.value).toBe('123456');
  });

  test('submits the form and stores user info', async () => {
    const setUser = jest.fn();

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'token-123',
        user: { name: 'John Doe', role: 'user' },
      }),
    });

    render(<Signup setUser={setUser} />);

    fireEvent.change(screen.getByPlaceholderText(/John Doe/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText(/name@example.com/i), { target: { value: 'john@test.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Min. 6 characters/i), { target: { value: '123456' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/user/register', expect.objectContaining({
        method: 'POST',
      }));
    });

    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'token-123');
    expect(localStorage.setItem).toHaveBeenCalledWith('name', 'John Doe');
    expect(localStorage.setItem).toHaveBeenCalledWith('role', 'user');
    expect(setUser).toHaveBeenCalledWith({ name: 'John Doe' });
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
