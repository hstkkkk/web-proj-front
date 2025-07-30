// test/Counter.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Counter from '../src/Counter'

describe('Counter component', () => {
    it('increments count when button is clicked', () => {
        render(<Counter />)
        const button = screen.getByText('Increment')
        const countDisplay = screen.getByTestId('count')

        expect(countDisplay).toHaveTextContent('0')
        fireEvent.click(button)
        expect(countDisplay).toHaveTextContent('1')
    })
})
