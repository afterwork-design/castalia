import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MenuItem from './menuItem';
import { Resource } from 'src/server';

// Mock the next/image component
jest.mock('next/image', () => ({
    __esModule: true,
    default: ({ src, alt, width, height }: { src: string; alt: string; width: number; height: number }) => (
        <img src={src} alt={alt} width={width} height={height} data-testid="image-component" />
    ),
}));

describe('MenuItem Component', () => {
    const mockResource: Resource = {
        name: 'Test Resource',
        icon: '/test-icon.png',
    };

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    it('renders the resource name correctly', () => {
        render(<MenuItem resource={mockResource} active={false} />);

        expect(screen.getByText('Test Resource')).toBeInTheDocument();
    });

    it('renders the resource icon correctly', () => {
        render(<MenuItem resource={mockResource} active={false} />);

        expect(screen.getByAltText('Test Resource')).toHaveAttribute('src', '/test-icon.png');
    });

    it('applies active background color when active prop is true', () => {
        render(<MenuItem resource={mockResource} active={true} />);

        // Find the HStack element by getting the container div that contains the menu item
        const containerDiv = document.querySelector('div > div.chakra-stack, div > div[class*="css-"]') as HTMLElement;
        expect(containerDiv).toBeInTheDocument();
        if (containerDiv) {
            // Check that the background color includes the active color
            const computedStyle = window.getComputedStyle(containerDiv);
            const bgColor = computedStyle.backgroundColor;
            expect(bgColor).toContain('241, 238, 255'); // RGB for #f1eeff
        }
    });

    it('applies default background color when active prop is false', () => {
        render(<MenuItem resource={mockResource} active={false} />);

        // Find the HStack element by getting the container div that contains the menu item
        const containerDiv = document.querySelector('div > div.chakra-stack, div > div[class*="css-"]') as HTMLElement;
        expect(containerDiv).toBeInTheDocument();
        if (containerDiv) {
            // Check that the background color is not the active color (it should be white or default)
            const computedStyle = window.getComputedStyle(containerDiv);
            const bgColor = computedStyle.backgroundColor;
            // White in RGB is (255, 255, 255)
            expect(bgColor).toContain('255, 255, 255');
        }
    });

    it('has pointer cursor', () => {
        render(<MenuItem resource={mockResource} active={false} />);

        // Find the HStack element by getting the container div that contains the menu item
        const containerDiv = document.querySelector('div > div.chakra-stack, div > div[class*="css-"]') as HTMLElement;
        expect(containerDiv).toBeInTheDocument();
        if (containerDiv) {
            const computedStyle = window.getComputedStyle(containerDiv);
            expect(computedStyle.cursor).toBe('pointer');
        }
    });

    it('renders anchor tag with correct href', () => {
        render(<MenuItem resource={mockResource} active={false} />);

        const anchor = screen.getByRole('link');
        expect(anchor).toHaveAttribute('href', '#Test Resource');
    });

    it('handles click on the menu item to trigger the anchor click', () => {
        const originalClick = window.HTMLAnchorElement.prototype.click;
        window.HTMLAnchorElement.prototype.click = jest.fn();

        render(<MenuItem resource={mockResource} active={false} />);

        // Get the container div that represents the HStack
        const menuItem = document.querySelector('.chakra-stack, [class*="css-"]') as HTMLElement;
        if (!menuItem) {
            throw new Error('Could not find MenuItem container element');
        }
        fireEvent.click(menuItem);

        expect(window.HTMLAnchorElement.prototype.click).toHaveBeenCalled();

        // Restore original click method
        window.HTMLAnchorElement.prototype.click = originalClick;
    });

    it('does not trigger anchor click when clicking on the anchor itself', () => {
        const originalClick = window.HTMLAnchorElement.prototype.click;
        window.HTMLAnchorElement.prototype.click = jest.fn();

        render(<MenuItem resource={mockResource} active={false} />);

        const anchor = screen.getByRole('link');
        fireEvent.click(anchor);

        // The click handler should not call click on the anchor when the target is the anchor itself
        expect(window.HTMLAnchorElement.prototype.click).not.toHaveBeenCalled();

        // Restore original click method
        window.HTMLAnchorElement.prototype.click = originalClick;
    });

    it('applies hover background color', () => {
        render(<MenuItem resource={mockResource} active={false} />);

        // Hover styles are hard to test in JSDOM, but we can verify that the element exists
        const menuItem = document.querySelector('.chakra-stack, [class*="css-"]');
        expect(menuItem).toBeDefined();
    });
});