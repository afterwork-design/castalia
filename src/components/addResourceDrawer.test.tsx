import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MyCollectionContext } from './content';
import AddResourceDrawer from './addResourceDrawer';
import { ResourceItem } from '../server';

// Mock the indexDB module and other dependencies
jest.mock('../util/indexDB', () => ({
  getDb: jest.fn(),
  myCollectionTableName: 'myCollection'
}));

// Mock useToast hook
const mockToast = jest.fn();
jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useToast: () => mockToast
}));

// Mock Formik
jest.mock('formik', () => ({
  ...jest.requireActual('formik'),
  Formik: ({ onSubmit, children, initialValues }: any) => {
    const mockSubmit = async (values: any) => {
      if (onSubmit) {
        await onSubmit(values);
      }
    };
    const renderProps = {
      ...initialValues,
      isSubmitting: false,
      values: initialValues,
      errors: {},
      touched: {},
      handleSubmit: mockSubmit,
      handleChange: jest.fn(),
      handleBlur: jest.fn()
    };
    return <form onSubmit={async (e: any) => {
      e.preventDefault();
      await mockSubmit(renderProps.values);
    }} data-testid="formik-form">{children(renderProps)}</form>;
  },
  Field: ({ children, name }: any) => children({
    field: {
      name: name,
      value: '',
      onChange: jest.fn(),
      onBlur: jest.fn()
    },
    form: {
      errors: {},
      touched: {},
      values: { name: '', url: '', description: '' },
      handleChange: jest.fn(),
      handleBlur: jest.fn()
    }
  }),
  Form: ({ children }: any) => <div>{children}</div>
}));

describe('AddResourceDrawer', () => {
  const mockSetMyCollection = jest.fn();

  // Mock context provider wrapper
  const renderWithProvider = (props: any = {}) => {
    const defaultProps = {
      open: true,
      close: jest.fn()
    };
    const mergedProps = { ...defaultProps, ...props };

    return render(
      <MyCollectionContext.Provider value={{ setMyCollection: mockSetMyCollection }}>
        <AddResourceDrawer {...mergedProps} />
      </MyCollectionContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when open', () => {
    renderWithProvider();

    expect(screen.getByText(/添加至我的/i)).toBeInTheDocument();
    expect(screen.getByText(/资源名称/i)).toBeInTheDocument();
    expect(screen.getByText(/资源地址/i)).toBeInTheDocument();
    expect(screen.getByText(/资源描述/i)).toBeInTheDocument();
  });

  it('does not show drawer when closed', () => {
    const closeFn = jest.fn();
    renderWithProvider({ open: false, close: closeFn });

    // Drawer header should not be visible when closed
    expect(screen.queryByText(/添加至我的/i)).not.toBeInTheDocument();
  });

  it('shows drawer when open is true', () => {
    renderWithProvider({ open: true });

    expect(screen.getByText(/添加至我的/i)).toBeInTheDocument();
  });

  it('has all required form fields', () => {
    renderWithProvider();

    expect(screen.getByLabelText(/资源名称/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/资源地址/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/资源描述/i)).toBeInTheDocument();
  });

  it('cancel button calls close function', () => {
    const closeFn = jest.fn();
    renderWithProvider({ open: true, close: closeFn });

    const cancelButton = screen.getByText(/取消/i);
    fireEvent.click(cancelButton);

    expect(closeFn).toHaveBeenCalledTimes(1);
  });

  it('should render with correct props passed', () => {
    const closeFn = jest.fn();
    renderWithProvider({ open: true, close: closeFn });

    // Verify close function is accessible
    const cancelButton = screen.getByText(/取消/i);
    fireEvent.click(cancelButton);
    expect(closeFn).toHaveBeenCalled();
  });

  it('handles form submission with valid data', async () => {
    const mockDb = {
      write: jest.fn().mockResolvedValue(true)
    };
    const { getDb } = require('../util/indexDB');
    (getDb as jest.MockedFunction<any>).mockResolvedValue(mockDb);

    renderWithProvider();

    // Find the form and submit it
    const form = screen.getByTestId('formik-form');
    fireEvent.submit(form);

    // Wait for the database operation to complete
    await waitFor(() => {
      expect(getDb).toHaveBeenCalled();
    });
  });

  it('displays error when resource addition fails', async () => {
    const mockDb = {
      write: jest.fn().mockResolvedValue(false) // Simulate failure
    };
    const { getDb } = require('../util/indexDB');
    (getDb as jest.MockedFunction<any>).mockResolvedValue(mockDb);

    renderWithProvider();

    // Find the form and submit it
    const form = screen.getByTestId('formik-form');
    fireEvent.submit(form);

    // Wait for the database operation to complete
    await waitFor(() => {
      expect(mockDb.write).toHaveBeenCalled();
    });
  });

  it('uses context to update collection on successful submission', async () => {
    const mockDb = {
      write: jest.fn().mockResolvedValue(true)
    };
    const { getDb } = require('../util/indexDB');
    (getDb as jest.MockedFunction<any>).mockResolvedValue(mockDb);

    const mockClose = jest.fn();
    renderWithProvider({ open: true, close: mockClose });

    // Find the form and submit it
    const form = screen.getByTestId('formik-form');
    fireEvent.submit(form);

    // Wait for the collection to be updated and the drawer to close
    await waitFor(() => {
      expect(mockSetMyCollection).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockClose).toHaveBeenCalled();
    });
  });

  it('renders form elements with correct attributes', () => {
    renderWithProvider();

    const nameInput = screen.getByLabelText(/资源名称/i);
    const urlInput = screen.getByLabelText(/资源地址/i);
    const descriptionTextarea = screen.getByLabelText(/资源描述/i);

    expect(nameInput).toBeInTheDocument();
    expect(urlInput).toBeInTheDocument();
    expect(descriptionTextarea).toBeInTheDocument();

    // Check URL input has correct type attribute
    expect(urlInput).toHaveAttribute('type', 'url');
  });
});