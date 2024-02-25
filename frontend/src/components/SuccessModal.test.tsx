import '@testing-library/jest-dom';
import React from 'react';

import { render, fireEvent } from '@testing-library/react';
import SuccessModal from './SuccessModal';

describe('SuccessModal', () => {
    let originalLocation: Location;

    beforeEach(() => {
        originalLocation = window.location;
        // @ts-ignore
        delete window.location;
        // @ts-ignore
        window.location = { reload: jest.fn() } as Location;
    });

    afterEach(() => {
        window.location = originalLocation;
    });

    it('success', () => {
        const { getByText } = render(
            <SuccessModal
                modalTitle="Test Title"
                successMessage="Test Success Message"
            />
        );
        expect(getByText('Test Title')).toBeInTheDocument();
        expect(getByText('Test Success Message')).toBeInTheDocument();
    });

    it('close on click', () => {
        const { getByText } = render(
            <SuccessModal
                modalTitle="Test Title"
                successMessage="Test Success Message"
            />
        );
        const closeButton = getByText('X');
        fireEvent.click(closeButton);
        expect(window.location.reload).toHaveBeenCalled();
    });

    it('successMessage is empty', () => {
        const { queryByText } = render(
            <SuccessModal
                modalTitle="Test Title"
                successMessage=""
            />
        );
        expect(queryByText('Test Title')).not.toBeInTheDocument();
        expect(queryByText('Test Success Message')).not.toBeInTheDocument();
    });
});