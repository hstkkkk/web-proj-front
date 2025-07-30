import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../../src/components/Header';
import { UserProvider } from '../../src/contexts/UserContext';

// Mock API
vi.mock('../../src/services/api');

describe('Header', () => {
  it('should render header component', () => {
    render(
      <BrowserRouter>
        <UserProvider>
          <Header />
        </UserProvider>
      </BrowserRouter>
    );

    // Just test that it renders without error
    expect(document.body).toBeTruthy();
  });
});