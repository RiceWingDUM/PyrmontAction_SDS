// tests/unit/Footer.spec.js
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import Footer from "../../frontend/src/components/Footer.vue";

// Mock the galleryService to avoid real HTTP calls
vi.mock("../../frontend/src/features/gallery/services/galleryServices", () => ({
  default: {
    getAllImages: vi.fn().mockResolvedValue({
      images: [
        { image_id: 1, image_file_name: "img1.jpg", caption: "Image 1" },
        { image_id: 2, image_file_name: "img2.jpg", caption: "Image 2" },
      ],
    }),
  },
}));

describe("Footer.vue", () => {
  let wrapper;

  beforeEach(async () => {
    wrapper = mount(Footer, {
      global: {
        stubs: ["router-link"], // prevent full router-link rendering
      },
    });

    // Wait for async fetchData to finish
    await Promise.resolve();
  });

  it("renders footer and key sections correctly", () => {
    expect(wrapper.find(".footer-body").exists()).toBe(true);
    expect(wrapper.text()).toContain("Our Partners");
    expect(wrapper.text()).toContain("Gallery");
    expect(wrapper.text()).toContain("Contact Us");
  });
});
