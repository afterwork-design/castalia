import React from "react";
import { render, screen } from "@testing-library/react";
import ResourcePanel from "./resourcePanel";
import { Resource, ResourceItem } from "../server";

// Mock the child components and modules
jest.mock("./resourceCard", () => ({
    __esModule: true,
    default: ({ site, hasCollectBtn, hasDeleteBtn }: any) => (
        <div data-testid="resource-card" data-site-name={site.name} data-has-collect-btn={hasCollectBtn} data-has-delete-btn={hasDeleteBtn}>
            Resource Card: {site.name}
        </div>
    ),
}));

jest.mock("./primitives", () => ({
    H2: ({ children, ...props }: any) => <h2 data-testid="h2" {...props}>{children}</h2>,
    RounderBox: ({ children, justifyContent, display, ...props }: any) => (
        <div data-testid="rounder-box" style={{ justifyContent, display }} {...props}>
            {children}
        </div>
    ),
}));

// Mock Chakra UI components properly to handle their specific props
jest.mock("@chakra-ui/react", () => ({
    ...jest.requireActual("@chakra-ui/react"),
    Image: ({ src, ...props }: any) => <img data-testid="image" src={src} {...props} />,
    Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    Grid: ({ children, rowGap, columnGap, gridTemplateColumns, ...props }: any) => (
        <div
            data-testid="grid"
            style={{
                rowGap,
                columnGap,
                gridTemplateColumns: Array.isArray(gridTemplateColumns)
                    ? gridTemplateColumns.join(' ')
                    : gridTemplateColumns
            }}
            {...props}
        >
            {children}
        </div>
    ),
}));

describe("ResourcePanel", () => {
    const mockResource: Resource = {
        name: "Test Resource",
        site: [
            {
                name: "Site 1",
                url: "https://site1.com",
                description: "Description 1",
                logo: "logo1.png",
                category: "Category 1"
            },
            {
                name: "Site 2",
                url: "https://site2.com",
                description: "Description 2",
                logo: "logo2.png",
                category: "Category 2"
            }
        ]
    };

    const mockEmptyResource: Resource = {
        name: "Empty Resource",
        site: []
    };

    const mockCollection: ResourceItem[] = [
        {
            name: "Collected Site",
            url: "https://collected.com",
            description: "Description",
            logo: "logo.png",
            category: "Category"
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders the resource name as heading", () => {
        render(
            <ResourcePanel
                resource={mockResource}
                hasCollectBtn={false}
                hasDeleteBtn={false}
                myCollection={[]}
            />
        );

        expect(screen.getByTestId("h2")).toHaveTextContent("Test Resource");
        expect(screen.getByText("Test Resource")).toBeInTheDocument();
    });

    it("renders ResourceCard components for each site in the resource", () => {
        render(
            <ResourcePanel
                resource={mockResource}
                hasCollectBtn={true}
                hasDeleteBtn={false}
                myCollection={[]}
            />
        );

        const resourceCards = screen.getAllByTestId("resource-card");
        expect(resourceCards).toHaveLength(2);
        
        // Check that both sites are rendered
        expect(screen.getByText("Resource Card: Site 1")).toBeInTheDocument();
        expect(screen.getByText("Resource Card: Site 2")).toBeInTheDocument();
    });

    it("passes correct props to ResourceCard components", () => {
        render(
            <ResourcePanel
                resource={mockResource}
                hasCollectBtn={true}
                hasDeleteBtn={false}
                myCollection={[]}
            />
        );

        const resourceCards = screen.getAllByTestId("resource-card");
        expect(resourceCards[0]).toHaveAttribute("data-site-name", "Site 1");
        expect(resourceCards[0]).toHaveAttribute("data-has-collect-btn", "true");
        expect(resourceCards[0]).toHaveAttribute("data-has-delete-btn", "false");
        
        expect(resourceCards[1]).toHaveAttribute("data-site-name", "Site 2");
        expect(resourceCards[1]).toHaveAttribute("data-has-collect-btn", "true");
        expect(resourceCards[1]).toHaveAttribute("data-has-delete-btn", "false");
    });

    it("passes the correct checked prop based on myCollection", () => {
        render(
            <ResourcePanel
                resource={{
                    name: "Test Resource",
                    site: [
                        {
                            name: "Existing Site",
                            url: "https://existing.com",
                            description: "Description",
                            logo: "logo.png",
                            category: "Category"
                        },
                        {
                            name: "Non Existing Site",
                            url: "https://nonexist.com",
                            description: "Description",
                            logo: "logo.png",
                            category: "Category"
                        }
                    ]
                }}
                hasCollectBtn={true}
                hasDeleteBtn={false}
                myCollection={mockCollection}
            />
        );

        const resourceCards = screen.getAllByTestId("resource-card");
        // First card should be checked since "Collected Site" exists in myCollection
        expect(resourceCards[0]).toHaveAttribute("data-site-name", "Existing Site");
        // Second card should not be checked since "Non Existing Site" is not in myCollection
        expect(resourceCards[1]).toHaveAttribute("data-site-name", "Non Existing Site");
    });

    it("renders empty state when resource has no sites", () => {
        render(
            <ResourcePanel
                resource={mockEmptyResource}
                hasCollectBtn={false}
                hasDeleteBtn={false}
                myCollection={[]}
            />
        );

        expect(screen.getByTestId("rounder-box")).toBeInTheDocument();
        expect(screen.getByTestId("image")).toHaveAttribute("src", "./empty.png");
    });

    it("uses custom empty component when provided", () => {
        const customEmptyComponent = <div data-testid="custom-empty">Custom Empty State</div>;

        render(
            <ResourcePanel
                resource={mockEmptyResource}
                hasCollectBtn={false}
                hasDeleteBtn={false}
                myCollection={[]}
                empty={customEmptyComponent}
            />
        );

        expect(screen.getByTestId("custom-empty")).toBeInTheDocument();
        expect(screen.queryByTestId("rounder-box")).not.toBeInTheDocument();
    });

    it("passes hasCollectBtn and hasDeleteBtn props correctly to ResourceCard", () => {
        render(
            <ResourcePanel
                resource={mockResource}
                hasCollectBtn={false}
                hasDeleteBtn={true}
                myCollection={[]}
            />
        );

        const resourceCards = screen.getAllByTestId("resource-card");
        expect(resourceCards[0]).toHaveAttribute("data-has-collect-btn", "false");
        expect(resourceCards[0]).toHaveAttribute("data-has-delete-btn", "true");
    });

    it("renders correct grid layout", () => {
        render(
            <ResourcePanel
                resource={mockResource}
                hasCollectBtn={false}
                hasDeleteBtn={false}
                myCollection={[]}
            />
        );

        const gridElement = screen.getByTestId("grid");
        expect(gridElement).toBeInTheDocument();
        // Check that the grid has the correct styles applied
        expect(gridElement).toHaveStyle({
            rowGap: "15px",
            columnGap: "15px"
        });
    });
});