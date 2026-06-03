import React from 'react';
import { LayoutPage } from './typing';

// Mock component for testing
const MockComponent: React.FC = () => React.createElement('div', null, 'Mock Component');

describe('LayoutPage Interface', () => {
  it('should extend React.FC', () => {
    // Verify that LayoutPage can be used as a React component
    const layoutPage: LayoutPage = () => React.createElement('div', null, 'Test');

    // Should be callable as a function component
    expect(() => layoutPage({})).not.toThrow();

    // Should render as JSX element
    const result = layoutPage({});
    expect(React.isValidElement(result)).toBe(true);
  });

  it('should support generic type parameter', () => {
    // Define props interface
    interface TestProps {
      title: string;
      count: number;
    }

    // Create a LayoutPage with specific props type
    const typedLayoutPage: LayoutPage<TestProps> = ({ title, count }: TestProps) => (
      React.createElement('div', null, `${title}: ${count}`)
    );

    // Should accept correct props
    expect(() => typedLayoutPage({ title: 'Test Title', count: 42 })).not.toThrow();

    // Should return valid JSX element
    const result = typedLayoutPage({ title: 'Test Title', count: 99 });
    expect(React.isValidElement(result)).toBe(true);
  });

  it('should have optional getLayout property', () => {
    const layoutPage: LayoutPage = () => React.createElement('div', null, 'Test');

    // Initially should not have getLayout
    expect(layoutPage.getLayout).toBeUndefined();

    // Should allow assignment of getLayout
    const mockLayout = (page: JSX.Element) => React.createElement('div', null,
      React.createElement('div', { key: 'layout-container' }, [
        React.createElement('header', { key: 'header' }, 'Header'),
        page
      ])
    );
    layoutPage.getLayout = mockLayout;

    expect(layoutPage.getLayout).toBeDefined();
    expect(typeof layoutPage.getLayout).toBe('function');

    // Should work with the assigned getLayout function
    const wrapped = layoutPage.getLayout(React.createElement('div', { key: 'content' }, 'Content'));
    expect(React.isValidElement(wrapped)).toBe(true);
  });

  it('should support getLayout with various layouts', () => {
    const layoutPage: LayoutPage<{ message: string }> = ({ message }) => (
      React.createElement('div', { key: 'main-content' }, `Content: ${message}`)
    );

    // Different layout implementations
    const sidebarLayout = (page: JSX.Element) => (
      React.createElement('div', { key: 'sidebar-layout' }, [
        React.createElement('aside', { key: 'sidebar' }, 'Sidebar'),
        page
      ])
    );

    const headerFooterLayout = (page: JSX.Element) => (
      React.createElement('div', { key: 'header-footer-layout' }, [
        React.createElement('header', { key: 'header' }, 'Header'),
        page,
        React.createElement('footer', { key: 'footer' }, 'Footer')
      ])
    );

    layoutPage.getLayout = sidebarLayout;
    const withSidebar = layoutPage.getLayout(React.createElement('div', { key: 'test-content' }, 'Test'));
    expect(React.isValidElement(withSidebar)).toBe(true);

    layoutPage.getLayout = headerFooterLayout;
    const withHeaderFooter = layoutPage.getLayout(React.createElement('div', { key: 'test-content2' }, 'Test'));
    expect(React.isValidElement(withHeaderFooter)).toBe(true);
  });

  it('should work without getLayout being defined', () => {
    const layoutPage: LayoutPage<{ name: string }> = ({ name }) => (
      React.createElement('div', null, `Hello, ${name}!`)
    );

    // Should work normally even without getLayout
    const result = layoutPage({ name: 'World' });
    expect(React.isValidElement(result)).toBe(true);
    expect(layoutPage.getLayout).toBeUndefined();
  });

  it('should maintain React.FC properties', () => {
    const layoutPage: LayoutPage<{ value: number }> = ({ value }) => (
      React.createElement('span', { key: 'value-span' }, value)
    );

    // Functions created as arrow functions don't automatically have displayName
    // but React.FC types can have displayName assigned if needed
    // Simply check that it's a function that works as a component
    expect(typeof layoutPage).toBe('function');

    // Should be callable and return JSX
    const jsxResult = layoutPage({ value: 123 });
    expect(React.isValidElement(jsxResult)).toBe(true);
  });
});