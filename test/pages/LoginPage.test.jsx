import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../../src/pages/LoginPage';
import { UserProvider } from '../../src/contexts/UserContext';
import * as api from '../../src/services/api';

// Mock API
vi.mock('../../src/services/api', () => ({
  userAPI: {
    login: vi.fn(),
  }
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <UserProvider>
        {component}
      </UserProvider>
    </BrowserRouter>
  );
};

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render login form', () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByRole('heading', { name: /登录账户/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/用户名/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/密码/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /登录/i })).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    renderWithProviders(<LoginPage />);

    const loginButton = screen.getByRole('button', { name: /登录/i });
    
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('请输入用户名')).toBeInTheDocument();
      expect(screen.getByText('请输入密码')).toBeInTheDocument();
    });
  });

  it('should handle successful login', async () => {
    api.userAPI.login.mockResolvedValue({
      success: true,
      data: { user: { id: 1, username: 'testuser' }, token: 'test-token' }
    });

    renderWithProviders(<LoginPage />);

    const usernameInput = screen.getByLabelText(/用户名/i);
    const passwordInput = screen.getByLabelText(/密码/i);
    const loginButton = screen.getByRole('button', { name: /登录/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(api.userAPI.login).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123'
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should handle login failure', async () => {
    api.userAPI.login.mockResolvedValue({
      success: false,
      message: '用户名或密码错误'
    });

    renderWithProviders(<LoginPage />);

    const usernameInput = screen.getByLabelText(/用户名/i);
    const passwordInput = screen.getByLabelText(/密码/i);
    const loginButton = screen.getByRole('button', { name: /登录/i });

    fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('用户名或密码错误')).toBeInTheDocument();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should show loading state during login', async () => {
    api.userAPI.login.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    renderWithProviders(<LoginPage />);

    const usernameInput = screen.getByLabelText(/用户名/i);
    const passwordInput = screen.getByLabelText(/密码/i);
    const loginButton = screen.getByRole('button', { name: /登录/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    expect(screen.getByText('登录中...')).toBeInTheDocument();
    expect(loginButton).toBeDisabled();
  });

  it('should clear errors when user types', async () => {
    renderWithProviders(<LoginPage />);

    const usernameInput = screen.getByLabelText(/用户名/i);
    const loginButton = screen.getByRole('button', { name: /登录/i });

    // 触发验证错误
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('请输入用户名')).toBeInTheDocument();
    });

    // 输入内容应该清除错误
    fireEvent.change(usernameInput, { target: { value: 'test' } });

    await waitFor(() => {
      expect(screen.queryByText('请输入用户名')).not.toBeInTheDocument();
    });
  });
});
