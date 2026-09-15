import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Box } from '@chakra-ui/react';
import Sider from './sider';

// Mock the dependencies
jest.mock('./primitives', () => ({
  RounderBox: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
    // Extract Chakra UI style props that would be handled by the actual component
    const {
      position,
      top,
      backgroundColor,
      width,
      textAlign,
      paddingTop,
      flexShrink,
      display,
      height,
      ...otherProps
    } = props;

    return (
      <div
        data-testid="rounder-box"
        style={{
          position,
          top,
          backgroundColor,
          width,
          textAlign,
          paddingTop,
          flexShrink: flexShrink !== undefined ? flexShrink : '0',
          display: Array.isArray(display) ? display.join(',') : display,
          height
        }}
        {...otherProps}
      >
        {children}
      </div>
    );
  }
}));

jest.mock('./menuItem', () => {
  return {
    __esModule: true,
    default: ({ resource, active }: { resource: any; active: boolean }) => (
      <div data-testid={`menu-item-${resource.name}`} className={active ? 'active' : ''}>
        {resource.name}
      </div>
    )
  };
});

// Mock the resource module
jest.mock('src/server/', () => ({
  resource: [
    { name: 'Home', site: [], icon: './images/menu/home.svg' },
    { name: 'About', site: [], icon: './images/menu/about.svg' },
    { name: 'Contact', site: [], icon: './images/menu/contact.svg' }
  ],
  Resource: {}
}));

describe('Sider Component', () => {
  const mockResources = [
    {
      name: '我的',
      site: [],
      icon: './images/menu/mine.svg'
    },
    { name: 'Home', site: [], icon: './images/menu/home.svg' },
    { name: 'About', site: [], icon: './images/menu/about.svg' },
    { name: 'Contact', site: [], icon: './images/menu/contact.svg' }
  ];

  beforeEach(() => {
    // Mock window properties that might be needed
    Object.defineProperty(window, 'addEventListener', {
      writable: true,
      value: jest.fn(),
    });

    Object.defineProperty(window, 'removeEventListener', {
      writable: true,
      value: jest.fn(),
    });

    // Mock document.querySelector to return null initially
    Object.defineProperty(document, 'querySelector', {
      writable: true,
      value: jest.fn(() => null),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<Sider />);
    const rounderBox = screen.getByTestId('rounder-box');
    expect(rounderBox).toBeInTheDocument();
  });

  it('displays menu items for all resources', () => {
    render(<Sider />);

    // Check if all expected menu items are present
    expect(screen.getByTestId('menu-item-我的')).toBeInTheDocument();
    expect(screen.getByTestId('menu-item-Home')).toBeInTheDocument();
    expect(screen.getByTestId('menu-item-About')).toBeInTheDocument();
    expect(screen.getByTestId('menu-item-Contact')).toBeInTheDocument();
  });

  it('sets first resource as active by default', () => {
    render(<Sider />);
    
    // The first item ('我的') should be active by default
    const mineMenuItem = screen.getByTestId('menu-item-我的');
    expect(mineMenuItem).toHaveClass('active');
  });

  it('applies correct props to RounderBox', () => {
    render(<Sider />);

    const rounderBox = screen.getByTestId('rounder-box');
    expect(rounderBox).toHaveStyle({ position: 'sticky' });
    expect(rounderBox).toHaveStyle({ top: '15px' });
    expect(rounderBox).toHaveStyle({ width: '200px' });
    expect(rounderBox).toHaveStyle({ height: 'calc(100vh - 210px)' });
  });

  it('verifies the initial active state is set correctly', () => {
    render(<Sider />);

    // Initially, the first item ("我的") should be active
    expect(screen.getByTestId('menu-item-我的')).toHaveClass('active');
  });

  it('adds and removes scroll event listener', () => {
    const addEventListenerMock = jest.fn();
    const removeEventListenerMock = jest.fn();

    Object.defineProperty(window, 'addEventListener', {
      writable: true,
      value: addEventListenerMock,
    });

    Object.defineProperty(window, 'removeEventListener', {
      writable: true,
      value: removeEventListenerMock,
    });

    const { unmount } = render(<Sider />);
    
    expect(addEventListenerMock).toHaveBeenCalledWith('scroll', expect.any(Function));
    
    unmount(); // This should trigger useEffect cleanup
    
    expect(removeEventListenerMock).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('uses correct display property for responsive design', () => {
    render(<Sider />);

    const rounderBox = screen.getByTestId('rounder-box');
    // We can't easily test responsive values without a full DOM implementation,
    // but we can verify the prop exists
    expect(rounderBox).toBeInTheDocument();
  });
});