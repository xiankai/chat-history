import { BASE_URL } from "../constants";

jest.mock("../constants", () => ({
  BASE_URL: "/",
}));

import { normalizePath } from "./url";

describe("normalizePath", () => {
  describe("when base url is /", () => {
    beforeEach(() => {
      (BASE_URL as any) = "/";
    });
    it("and path is root", () => {
      expect(normalizePath("/")).toEqual("/");
    });
    it("and any other path", () => {
      expect(normalizePath("/foo")).toEqual("/foo");
    });
  });

  describe("when base url is /chat-history/", () => {
    beforeEach(() => {
      (BASE_URL as any) = "/chat-history/";
    });
    it("and path is root", () => {
      expect(normalizePath("/")).toEqual("/chat-history");
    });
    it("and any other path", () => {
      expect(normalizePath("/foo")).toEqual("/chat-history/foo");
    });
  });
});
