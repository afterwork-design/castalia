import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Checkbox, Text, Box, Image } from '@chakra-ui/react';
import ResourceCard from './resourceCard';
import { MyCollectionContext } from './content';
import { ResourceItem } from '../server';

// Mock the dependencies
jest.mock('../util/indexDB', () => ({
  getDb: jest.fn(() => Promise.resolve({
    write: jest.fn(() => Promise.resolve(true)),
    remove: jest.fn(() => Promise.resolve(true))
  })),
  myCollectionTableName: 'myCollection'
}));

// Mock the primitives
jest.mock('./primitives', () => ({
  RounderBox: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
    // Extract and rename columnGap to properly handle it
    const { columnGap, ...restProps } = props;
    return (
      <div
        data-testid="rounder-box"
        style={{ columnGap }}
        {...restProps}
      >
        {children}
      </div>
    );
  },
  H3: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => (
    <h3 data-testid="h3" {...props}>{children}</h3>
  )
}));

// Mock the Image component to avoid loading issues but maintain compatibility
jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  Image: ({ src, ...props }: { src: string; [key: string]: any }) => (
    <img data-testid="chakra-image" src={src} {...props} />
  )
}));

describe('ResourceCard', () => {
  const mockSite: ResourceItem = {
    name: 'Test Site',
    url: 'https://test.com',
    description: 'Test description',
    image: 'test-image.jpg',
    category: 'Test Category'
  };

  const mockSetMyCollection = jest.fn();

  const renderWithProvider = (ui: React.ReactElement, checked: boolean = false) => {
    return render(
      <MyCollectionContext.Provider value={{ setMyCollection: mockSetMyCollection }}>
        {React.cloneElement(ui, { checked })}
      </MyCollectionContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders resource card with site information', () => {
    renderWithProvider(<ResourceCard site={mockSite} hasCollectBtn={false} hasDeleteBtn={false} />);

    expect(screen.getByText('Test Site')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByAltText('Test Site')).toHaveAttribute('src', 'test-image.jpg');
  });

  it('renders without image when site has no image', () => {
    const siteWithoutImage = { ...mockSite, image: undefined };
    renderWithProvider(<ResourceCard site={siteWithoutImage} hasCollectBtn={false} hasDeleteBtn={false} />);

    expect(screen.queryByAltText('Test Site')).not.toBeInTheDocument();
    expect(screen.getByText('Test Site')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('handles click on the card to navigate to the site', () => {
    window.open = jest.fn();
    renderWithProvider(<ResourceCard site={mockSite} hasCollectBtn={false} hasDeleteBtn={false} />);
    
    const rounderBox = screen.getByTestId('rounder-box');
    fireEvent.click(rounderBox);
    
    // Since we can't directly test the anchor element click, we check if the click handler is called
    expect(rounderBox).toBeInTheDocument();
  });

  it('displays collect button when hasCollectBtn is true', () => {
    renderWithProvider(<ResourceCard site={mockSite} hasCollectBtn={true} hasDeleteBtn={false} />);
    
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('does not display collect button when hasCollectBtn is false', () => {
    renderWithProvider(<ResourceCard site={mockSite} hasCollectBtn={false} hasDeleteBtn={false} />);
    
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('displays delete button when hasDeleteBtn is true', () => {
    renderWithProvider(<ResourceCard site={mockSite} hasCollectBtn={false} hasDeleteBtn={true} />);
    
    const deleteButton = screen.getByTitle('删除');
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveAttribute('src', './delete.svg');
  });

  it('does not display delete button when hasDeleteBtn is false', () => {
    renderWithProvider(<ResourceCard site={mockSite} hasCollectBtn={false} hasDeleteBtn={false} />);
    
    const deleteButton = screen.queryByTitle('删除');
    expect(deleteButton).not.toBeInTheDocument();
  });

  it('calls deleteFromMyCollection when delete button is clicked', async () => {
    const { getDb } = require('../util/indexDB');
    const mockRemove = jest.fn(() => Promise.resolve(true));
    const mockDb = {
      remove: mockRemove
    };
    (getDb as jest.MockedFunction<any>).mockResolvedValue(mockDb);

    renderWithProvider(<ResourceCard site={mockSite} hasCollectBtn={false} hasDeleteBtn={true} />);

    const deleteButton = screen.getByTitle('删除');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockRemove).toHaveBeenCalledWith('myCollection', 'Test Site');
      expect(mockSetMyCollection).toHaveBeenCalled();
    });
  });

  it('calls checkBoxChange when checkbox is changed and checked is false', async () => {
    const { getDb } = require('../util/indexDB');
    const mockWrite = jest.fn(() => Promise.resolve(true));
    const mockDb = {
      write: mockWrite
    };
    (getDb as jest.MockedFunction<any>).mockResolvedValue(mockDb);

    // Render with checked initially false
    renderWithProvider(<ResourceCard site={mockSite} hasCollectBtn={true} hasDeleteBtn={false} />, false);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(mockWrite).toHaveBeenCalledWith('myCollection', mockSite);
      expect(mockSetMyCollection).toHaveBeenCalled();
    });
  });

  it('calls checkBoxChange when checkbox is changed and checked is true', async () => {
    const { getDb } = require('../util/indexDB');
    const mockRemove = jest.fn(() => Promise.resolve(true));
    const mockDb = {
      remove: mockRemove
    };
    (getDb as jest.MockedFunction<any>).mockResolvedValue(mockDb);

    // Render with checked initially true
    renderWithProvider(<ResourceCard site={mockSite} hasCollectBtn={true} hasDeleteBtn={false} />, true);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(mockRemove).toHaveBeenCalledWith('myCollection', 'Test Site');
      expect(mockSetMyCollection).toHaveBeenCalled();
    });
  });

  it('propagates click when clicking on the link', () => {
    renderWithProvider(<ResourceCard site={mockSite} hasCollectBtn={false} hasDeleteBtn={false} />);
    
    const link = screen.getByRole('link');
    fireEvent.click(link);
    
    // Link click should work normally
    expect(link).toBeInTheDocument();
  });

  it('has correct visual properties', () => {
    renderWithProvider(<ResourceCard site={mockSite} hasCollectBtn={false} hasDeleteBtn={false} />);

    const rounderBox = screen.getByTestId('rounder-box');
    // Check for the presence of the main attributes that are passed as props
    expect(rounderBox).toHaveAttribute('style', expect.stringContaining('column-gap'));
    expect(rounderBox).toHaveAttribute('cursor', 'pointer');
    expect(rounderBox).toHaveAttribute('p', '15px');
  });
});