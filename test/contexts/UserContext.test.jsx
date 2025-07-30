import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { fireEvent, act } from '@testing-library/react';
import { UserProvider, useUser } from '../../src/contexts/UserContext';
import * as api from '../../src/services/api';

// Mock API
vi.mock('../../src/services/api');

// Test component that uses UserContext
const TestComponent = () => {
  const { user, login, register, logout } = useUser();

  const handleLogin = async () => {
    await login({ username: 'testuser', password: 'password123' });
  };

  const handleRegister = async () => {
    await register({
      username: 'newuser',
      password: 'password123',  
      email: 'test@example.com',
      phone: '13800138000',
      realName: 'Test User'
    });
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      <div data-testid="user-status">
        {user ? `Logged in as ${user.username}` : 'Not logged in'}
      </div>
      <button onClick={handleLogin} data-testid="login-btn">
        Login
      </button>
      <button onClick={handleRegister} data-testid="register-btn">
        Register
      </button>
      <button onClick={handleLogout} data-testid="logout-btn">
        Logout
      </button>
    </div>
  );
};

describe('UserContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Initial State', () => {
    it('should start with no user logged in', () => {
      render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );

      expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
    });
  });

  describe('Login', () => {
    it('should login successfully', async () => {
      api.userAPI.login.mockResolvedValue({
        success: true, 
        data: { id: 1, username: 'testuser', email: 'test@example.com' }
      });

      render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );

      const loginBtn = screen.getByTestId('login-btn');
      
      await act(async () => {
        fireEvent.click(loginBtn);
      });

      await waitFor(() => {
        expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in as testuser');
      });

      expect(api.userAPI.login).toHaveBeenCalledWith({ username: 'testuser', password: 'password123' });
    });
  });

  describe('Logout', () => {
    it('should logout successfully', async () => {
      const mockUser = { id: 1, username: 'testuser', email: 'test@example.com' };
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', 'mock-token');

      render(
        <UserProvider>
          <TestComponent />
        </UserProvider>
      );

      const logoutBtn = screen.getByTestId('logout-btn');
      
      act(() => {
        fireEvent.click(logoutBtn);
      });

      expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
    });
  });
});
