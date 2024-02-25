import '@testing-library/jest-dom'
import React from 'react';

import { render, fireEvent } from '@testing-library/react'
import CustomButton from './CustomButton';

describe('CustomButton', () => {
    it('success', () => {
        const onClickMock = jest.fn();
        const { getByText } = render(<CustomButton onClick={onClickMock} />);
        const buttonElement = getByText(/pagar/i);
        expect(buttonElement).toBeInTheDocument();
    });

    it('onClick', () => {
        const onClickMock = jest.fn();
        const { getByText } = render(<CustomButton onClick={onClickMock} />);
        const buttonElement = getByText(/pagar/i);
        fireEvent.click(buttonElement);
        expect(onClickMock).toHaveBeenCalledTimes(1);
    });
});