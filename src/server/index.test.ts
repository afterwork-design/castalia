import { site, resource, Site, Resource } from './index';

// Mock the JSON imports to test the module in isolation
jest.mock('./site.json', () => ({
    title: 'Test Site Title',
    description: 'Test Site Description',
    keywords: ['test', 'keywords', 'array'],
}));

jest.mock('./resource.json', () => [
    {
        name: 'Test Resource Category',
        site: [
            {
                name: 'Test Resource Site',
                description: 'Test Resource Site Description',
                url: 'https://test-resource-site.example.com',
                image: 'test-image.png',
            },
        ],
        icon: 'test-icon',
    },
]);

describe('Server Index Module', () => {
    describe('Site Interface', () => {
        it('should have correct structure', () => {
            expect(site).toBeDefined();
            expect(typeof site.title).toBe('string');
            expect(typeof site.description).toBe('string');
            expect(Array.isArray(site.keywords)).toBe(true);
        });

        it('should conform to Site interface', () => {
            const validatedSite: Site = {
                title: 'Sample Title',
                description: 'Sample Description',
                keywords: ['keyword1', 'keyword2'],
            };

            expect(site.title).toBe('Test Site Title');
            expect(site.description).toBe('Test Site Description');
            expect(site.keywords).toEqual(['test', 'keywords', 'array']);
        });
    });

    describe('Resource Interface', () => {
        it('should have correct structure', () => {
            expect(resource).toBeDefined();
            expect(Array.isArray(resource)).toBe(true);

            if (resource.length > 0) {
                const firstResource = resource[0];
                expect(firstResource.name).toBeDefined();
                expect(firstResource.icon).toBeDefined();
                expect(Array.isArray(firstResource.site)).toBe(true);
                
                if (firstResource.site.length > 0) {
                    const firstSite = firstResource.site[0];
                    expect(firstSite.name).toBeDefined();
                    expect(firstSite.url).toBeDefined();
                }
            }
        });

        it('should conform to Resource interface', () => {
            if (resource.length > 0) {
                const validatedResource: Resource = {
                    name: 'Test Category',
                    site: [
                        {
                            name: 'Test Site',
                            url: 'https://example.com',
                            description: 'Test Description',
                            image: 'test.png',
                        },
                    ],
                    icon: 'test-icon',
                };

                const firstResource = resource[0];
                expect(firstResource.name).toBe('Test Resource Category');
                expect(firstResource.icon).toBe('test-icon');
                
                if (firstResource.site.length > 0) {
                    expect(firstResource.site[0].name).toBe('Test Resource Site');
                    expect(firstResource.site[0].url).toBe('https://test-resource-site.example.com');
                    expect(firstResource.site[0].description).toBe('Test Resource Site Description');
                    expect(firstResource.site[0].image).toBe('test-image.png');
                }
            }
        });
    });

    describe('Export Validation', () => {
        it('should export site object correctly', () => {
            expect(site).toHaveProperty('title');
            expect(site).toHaveProperty('description');
            expect(site).toHaveProperty('keywords');
            expect(Array.isArray(site.keywords)).toBe(true);
        });

        it('should export resource array correctly', () => {
            expect(Array.isArray(resource)).toBe(true);
            expect(resource).toBeDefined();
            
            // Check that each resource item conforms to expected shape
            for (const res of resource) {
                expect(res.name).toBeDefined();
                expect(res.icon).toBeDefined();
                expect(Array.isArray(res.site)).toBe(true);
                
                // Check that each site in the resource has required properties
                for (const siteItem of res.site) {
                    expect(siteItem.name).toBeDefined();
                    expect(siteItem.url).toBeDefined();
                }
            }
        });

        it('should maintain consistent data types', () => {
            // Validate that site properties are of expected types
            expect(typeof site.title).toBe('string');
            expect(typeof site.description).toBe('string');
            expect(Array.isArray(site.keywords)).toBe(true);
            
            // Validate that resource is an array with proper structure
            expect(Array.isArray(resource)).toBe(true);
        });
    });
});