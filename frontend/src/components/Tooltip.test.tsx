import '@testing-library/jest-dom';
import React from 'react';

import { render } from '@testing-library/react';
import Tooltip from './Tooltip';

describe('Tooltip', () => {
    it('success', () => {
        const { getByText } = render(
            <Tooltip hint="Test Hint" />
        );
        expect(getByText('Test Hint')).toBeInTheDocument();
    });
});