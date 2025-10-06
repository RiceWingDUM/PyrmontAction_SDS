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

  // Verify footer content correctly rendering
  it("renders footer and key sections correctly", () => {
    expect(wrapper.find(".footer-body").exists()).toBe(true);
    expect(wrapper.text()).toContain("Our Partners");
    expect(wrapper.text()).toContain("Gallery");
    expect(wrapper.text()).toContain("Contact Us");
  });

  // Verify partner links display correctly
  it("renders partner links correctly", () => {
    const partnerLinks = wrapper.findAll(".column a");
    const hrefs = partnerLinks.map((a) => a.attributes("href"));
    expect(hrefs).toContain("https://pyrmontultimolandcare.org.au/");
    expect(hrefs).toContain("https://jacksonslanding.net.au/");
  });

  // Verify gallery images load dynamically
  it("loads gallery images dynamically", async () => {
    const images = wrapper.findAll(".gallery img");
    expect(images.length).toBe(2);
    expect(images[0].attributes("src")).toContain("/src/assets/Gallery/img1.jpg");
  });
});
