import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../components/Login';
import { createMockLocalStorage } from './test-helpers';

const mockNavigate = jest.fn();

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>, // simple Link mock
}));

// Mock localStorage
// const localStorageMock = (() => {
//   let store = {};
//   return {
//     getItem: jest.fn((key) => store[key] || null),
//     setItem: jest.fn((key, value) => {
//       store[key] = value;
//     }),
//     clear: jest.fn(() => { store = {}; }),
//     removeItem: jest.fn((key) => { delete store[key]; }),
//   };
// })();
// Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Login', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    mockNavigate.mockClear();
    Object.defineProperty(window, 'localStorage', {
      value: createMockLocalStorage(),
      writable: true
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('updates the inputs as the user types', () => {
    render(<Login />);

    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);

    fireEvent.change(emailInput, { target: { value: 'student@test.com' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });

    expect(emailInput.value).toBe('student@test.com');
    expect(passwordInput.value).toBe('123456');
  });

  test('sends the credentials to the API and stores the token', async () => {
    const setUser = jest.fn();

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'token-123',
        user: { name: 'st123', role: 'student' },
      }),
    });

    render(<Login setUser={setUser} />);

    fireEvent.change(screen.getByPlaceholderText(/Enter your email/i), { target: { value: 'student@test.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your password/i), { target: { value: '123456' } });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/user/login', expect.objectContaining({
        method: 'POST',
      }));
    });

    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'token-123');
    expect(localStorage.setItem).toHaveBeenCalledWith('name', 'st123');
    expect(localStorage.setItem).toHaveBeenCalledWith('role', 'student');
    expect(setUser).toHaveBeenCalledWith({ name: 'st123' });
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
