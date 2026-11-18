import React from 'react';
import MyDocument from './_document';

// Mock the Next.js Document class methods
jest.mock('next/document', () => {
  const originalModule = jest.requireActual('next/document');

  return {
    __esModule: true,
    ...originalModule,
    default: class MockDocument {
      static async getInitialProps(ctx: any) {
        // Simulate the actual behavior of Document.getInitialProps
        const result = await ctx.renderPage();
        return {
          ...result,
          styles: []
        };
      }
    },
    Html: ({ children, lang }: { children: React.ReactNode; lang?: string }) => (
      <html lang={lang}>{children}</html>
    ),
    Head: ({ children }: { children: React.ReactNode }) => <head>{children}</head>,
    Main: () => <main />,
    NextScript: () => <script />
  };
});

describe('MyDocument', () => {
  it('should extend Document correctly', () => {
    expect(MyDocument).toBeDefined();
    expect(typeof MyDocument.getInitialProps).toBe('function');
  });

  it('should have getInitialProps method', () => {
    expect(MyDocument.getInitialProps).toBeDefined();
    expect(typeof MyDocument.getInitialProps).toBe('function');
  });

  it('should call parent getInitialProps and return spread object', async () => {
    const mockCtx: any = {
      renderPage: jest.fn().mockResolvedValue({
        html: '<div>Mock HTML</div>',
        head: [<link key="mock-link" />],
      }),
      pathname: '/',
      query: {},
      asPath: '/',
      AppTree: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    };

    const initialProps = await MyDocument.getInitialProps(mockCtx);

    // The method should return an object with the spread properties
    expect(initialProps).toBeDefined();
    expect(initialProps).toHaveProperty('html');
    expect(initialProps).toHaveProperty('head');
    expect(initialProps).toHaveProperty('styles');
  });

  it('should handle error cases gracefully', async () => {
    const mockCtx: any = {
      renderPage: jest.fn().mockRejectedValue(new Error('Render error')),
      pathname: '/',
      query: {},
      asPath: '/',
      AppTree: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    };

    await expect(MyDocument.getInitialProps(mockCtx)).rejects.toThrow('Render error');
  });

  it('should maintain the render method signature', () => {
    // Test that the render method exists and is callable
    const documentInstance = new (MyDocument as any)();
    expect(documentInstance.render).toBeDefined();
    expect(typeof documentInstance.render).toBe('function');
  });
});