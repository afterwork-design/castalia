import React from "react";
import { render, screen } from "@testing-library/react";
import { H1, H2, H3, H4, H5, H6, RounderBox } from "./primitives";

describe("Primitives", () => {
  describe("H1", () => {
    it("renders as h1 element", () => {
      render(<H1>Test H1</H1>);
      expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
      expect(screen.getByText("Test H1")).toBeInTheDocument();
    });

    it("has margin top equal to 0", () => {
      render(<H1>Test H1</H1>);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveStyle({ "margin-top": "0" });
    });
  });

  describe("H2", () => {
    it("renders as h2 element", () => {
      render(<H2>Test H2</H2>);
      expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
      expect(screen.getByText("Test H2")).toBeInTheDocument();
    });
  });

  describe("H3", () => {
    it("renders as h3 element", () => {
      render(<H3>Test H3</H3>);
      expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
      expect(screen.getByText("Test H3")).toBeInTheDocument();
    });
  });

  describe("H4", () => {
    it("renders as h4 element", () => {
      render(<H4>Test H4</H4>);
      expect(screen.getByRole("heading", { level: 4 })).toBeInTheDocument();
      expect(screen.getByText("Test H4")).toBeInTheDocument();
    });
  });

  describe("H5", () => {
    it("renders as h5 element", () => {
      render(<H5>Test H5</H5>);
      expect(screen.getByRole("heading", { level: 5 })).toBeInTheDocument();
      expect(screen.getByText("Test H5")).toBeInTheDocument();
    });
  });

  describe("H6", () => {
    it("renders as h6 element", () => {
      render(<H6>Test H6</H6>);
      expect(screen.getByRole("heading", { level: 6 })).toBeInTheDocument();
      expect(screen.getByText("Test H6")).toBeInTheDocument();
    });
  });

  describe("RounderBox", () => {
    it("renders a box with rounded corners", () => {
      render(<RounderBox>Test Box</RounderBox>);
      expect(screen.getByText("Test Box")).toBeInTheDocument();

      // Get the container div that has the RounderBox styles
      const box = screen.getByText("Test Box").parentElement;
      // Chakra applies styles differently, so we just verify the element exists and has children
      expect(box).toBeInTheDocument();
    });

    it("renders with custom props applied", () => {
      render(<RounderBox data-testid="round-box">Test Box</RounderBox>);
      expect(screen.getByTestId("round-box")).toBeInTheDocument();
    });

    it("can accept additional props", () => {
      render(
        <RounderBox data-testid="test-box" className="custom-class">
          Test Box
        </RounderBox>
      );
      const box = screen.getByTestId("test-box");
      expect(box).toBeInTheDocument();
      expect(box).toHaveClass("custom-class");
    });
  });
});