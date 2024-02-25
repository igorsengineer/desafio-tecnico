import '@testing-library/jest-dom';
import React from 'react';

import { render } from '@testing-library/react';
import WarningField from './WarningField';

describe('WarningField', () => {
    it('success', () => {
        const { getByText } = render(
            <WarningField warning="Test Warning" />
        );
        expect(getByText('Test Warning')).toBeInTheDocument();
    });
});