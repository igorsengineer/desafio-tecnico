import '@testing-library/jest-dom';
import React from 'react';

import { render, fireEvent } from '@testing-library/react';
import ErrorModal from './ErrorModal';

describe('ErrorModal', () => {
    it('success', () => {
        const { getByText } = render(
            <ErrorModal
                modalTitle="Test Title"
                errorMessage="Test Error Message"
                setErrorMessage={() => {}}
            />
        );
        expect(getByText('Test Title')).toBeInTheDocument();
        expect(getByText('Test Error Message')).toBeInTheDocument();
    });

    it('close click', () => {
        const setErrorMessageMock = jest.fn();
        const { getByText } = render(
            <ErrorModal
                modalTitle="Test Title"
                errorMessage="Test Error Message"
                setErrorMessage={setErrorMessageMock}
            />
        );
        const closeButton = getByText('X');
        fireEvent.click(closeButton);
        expect(setErrorMessageMock).toHaveBeenCalledWith('');
    });

    it('errorMessage empty', () => {
        const { queryByText } = render(
            <ErrorModal
                modalTitle="Test Title"
                errorMessage=""
                setErrorMessage={() => {}}
            />
        );
        expect(queryByText('Test Title')).not.toBeInTheDocument();
        expect(queryByText('Test Error Message')).not.toBeInTheDocument();
    });
});