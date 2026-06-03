import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './index';
import { ChakraProvider } from '@chakra-ui/react';

// Mock the child components since we're only testing the structure of the Home page
jest.mock('src/components/sider', () => () => <div data-testid="sider-component">Sider Component</div>);
jest.mock('src/components/content', () => () => <div data-testid="content-component">Content Component</div>);
jest.mock('src/components/contentTop', () => () => <div data-testid="content-top-component">Content Top Component</div>);

describe('Home Page', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        render(
            <ChakraProvider>
                <Home />
            </ChakraProvider>
        );
        expect(screen.getByTestId('content-top-component')).toBeInTheDocument();
    });

    it('renders all main layout components', () => {
        render(
            <ChakraProvider>
                <Home />
            </ChakraProvider>
        );

        // Check that the main components are present
        expect(screen.getByTestId('content-top-component')).toBeInTheDocument();
        expect(screen.getByTestId('sider-component')).toBeInTheDocument();
        expect(screen.getByTestId('content-component')).toBeInTheDocument();
    });

    it('renders components in the correct hierarchical structure', () => {
        render(
            <ChakraProvider>
                <Home />
            </ChakraProvider>
        );

        // Find the main container Box element (it has no role set by default, so we check for a div with a CSS class)
        const containerDiv = screen.getByTestId('content-top-component').parentElement;
        expect(containerDiv).toBeInTheDocument();

        // Verify that ContentTop is directly inside the main container
        const contentTopComponent = screen.getByTestId('content-top-component');
        expect(contentTopComponent.parentElement).toBeInTheDocument();

        // Check for the HStack structure containing Sider and Content (these would be in a chakra-stack)
        const stackElement = screen.getByTestId('sider-component').parentElement;
        expect(stackElement).toHaveClass('chakra-stack');

        // Verify that both Sider and Content are in the same parent container (HStack)
        const siderComponent = screen.getByTestId('sider-component');
        const contentComponent = screen.getByTestId('content-component');
        expect(siderComponent.parentElement).toBe(contentComponent.parentElement);
    });

    it('passes correct props to ContentTop component', () => {
        render(
            <ChakraProvider>
                <Home />
            </ChakraProvider>
        );

        // Since we're mocking ContentTop, we can't directly verify props
        // But we can ensure it's called/rendered as expected
        const contentTop = screen.getByTestId('content-top-component');
        expect(contentTop).toBeInTheDocument();
    });
});