import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Signup from '../components/Signup';
import { createMockLocalStorage } from './test-helpers';
 
const mockNavigate = jest.fn();
 
// Mock react-router-dom
jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    Link: ({ children, to }) => <a href={to}>{children}</a>,
}));
 
// Mock localStorage
describe('Signup', () => {
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
 
    test('lets the user fill in the form fields', () => {
        render(<Signup />);
 
        const nameInput = screen.getByPlaceholderText(/John Doe/i);
        const emailInput = screen.getByPlaceholderText(/name@example.com/i);
        const passwordInput = screen.getByPlaceholderText(/Min. 6 characters/i);
        const phoneInput = screen.getByPlaceholderText(/\(123\) 456-7890/i);
        const addressInput = screen.getByPlaceholderText(/123 Main St/i);
        const cityInput = screen.getByPlaceholderText(/Toronto/i);
 
        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(emailInput, { target: { value: 'john@test.com' } });
        fireEvent.change(passwordInput, { target: { value: '123456' } });
        fireEvent.change(phoneInput, { target: { value: '(123) 456-7890' } });
        fireEvent.change(addressInput, { target: { value: '123 Main St' } });
        fireEvent.change(cityInput, { target: { value: 'Toronto' } });
       
        expect(nameInput.value).toBe('John Doe');
        expect(emailInput.value).toBe('john@test.com');
        expect(passwordInput.value).toBe('123456');
        expect(phoneInput.value).toBe('(123) 456-7890');
        expect(addressInput.value).toBe('123 Main St');
        expect(cityInput.value).toBe('Toronto');
    });
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

  // Fill inputs
  fireEvent.change(screen.getByPlaceholderText(/John Doe/i), { target: { value: 'John Doe' } });
  fireEvent.change(screen.getByPlaceholderText(/name@example.com/i), { target: { value: 'john@test.com' } });
  fireEvent.change(screen.getByPlaceholderText(/Min. 6 characters/i), { target: { value: '123456' } });

  // Submit and await fetch
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
