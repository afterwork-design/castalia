import React from 'react';
import { render, screen } from '@testing-library/react';
import ContentTop from './contentTop';

describe('ContentTop Component', () => {
  const defaultProps = {
    description: 'Test description',
  };

  it('renders without crashing', () => {
    render(<ContentTop {...defaultProps} />);
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('displays the correct description text', () => {
    const description = 'Sample description text';
    render(<ContentTop description={description} />);

    const textElement = screen.getByText(description);
    expect(textElement).toBeInTheDocument();
    expect(textElement).toHaveTextContent(description);
  });

  it('renders the castalia.svg image', () => {
    render(<ContentTop {...defaultProps} />);

    const imageElement = screen.getByRole('img');
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', './castalia.svg');
  });

  it('renders with the correct structure', () => {
    render(<ContentTop {...defaultProps} />);

    // Check that both the image and text are present
    const imageElement = screen.getByRole('img');
    const textElement = screen.getByText('Test description');

    expect(imageElement).toBeInTheDocument();
    expect(textElement).toBeInTheDocument();
  });
});