// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import Signup from '../components/Signup';
// import { createMockLocalStorage } from './test-helpers';

// const mockNavigate = jest.fn();

// // Mock react-router-dom
// jest.mock('react-router-dom', () => ({
//   useNavigate: () => mockNavigate
// }));

// describe('Signup Component', () => {
//   beforeEach(() => {
//     global.fetch = jest.fn();
//     mockNavigate.mockClear();

//     Object.defineProperty(window, 'localStorage', {
//       value: createMockLocalStorage(),
//       writable: true
//     });
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   test('lets the user fill in the form fields', () => {
//     render(<Signup />);

//     const nameInput = screen.getByLabelText(/full name/i);
//     const emailInput = screen.getByLabelText(/^email$/i);
//     const passwordInput = screen.getByLabelText(/password/i);

//     fireEvent.change(nameInput, { target: { value: 'John Doe' } });
//     fireEvent.change(emailInput, { target: { value: 'john@test.com' } });
//     fireEvent.change(passwordInput, { target: { value: '123456' } });

//     expect(nameInput).toHaveValue('John Doe');
//     expect(emailInput).toHaveValue('john@test.com');
//     expect(passwordInput).toHaveValue('123456');
//   });

//   test('submits the form and stores the user info', async () => {
//     const setUser = jest.fn();

//     global.fetch.mockResolvedValueOnce({
//       ok: true,
//       json: async () => ({
//         token: 'token-123',
//         user: { name: 'John Doe', role: 'user' }
//       })
//     });

//     render(<Signup setUser={setUser} />);

//     fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
//     fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'john@test.com' } });
//     fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '123456' } });

//     fireEvent.click(screen.getByRole('button', { name: /register/i }));

//     await waitFor(() => {
//       expect(global.fetch).toHaveBeenCalledWith('/api/user/register', expect.objectContaining({
//         method: 'POST'
//       }));
//     });

//     expect(window.localStorage.setItem).toHaveBeenCalledWith('token', 'token-123');
//     expect(window.localStorage.setItem).toHaveBeenCalledWith('name', 'John Doe');
//     expect(window.localStorage.setItem).toHaveBeenCalledWith('role', 'user');
//     expect(setUser).toHaveBeenCalledWith({ name: 'John Doe' });
//     expect(mockNavigate).toHaveBeenCalledWith('/');
//   });

//   test('shows error message if API fails', async () => {
//     global.fetch.mockResolvedValueOnce({
//       ok: false,
//       json: async () => ({ message: 'Email already exists' })
//     });

//     render(<Signup />);

//     fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: 'john@test.com' } });
//     fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '123456' } });

//     fireEvent.click(screen.getByRole('button', { name: /register/i }));

//     await waitFor(() => {
//       expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
//     });

//     expect(mockNavigate).not.toHaveBeenCalled();
//   });
// });
