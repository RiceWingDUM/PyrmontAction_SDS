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

  // Verify contact info is correct in footer section
  it("contains correct contact information", () => {
    const text = wrapper.text();
    expect(text).toContain("79A John St, Pyrmont NSW 2009");
    expect(text).toContain("(+61) 414 997 089");
    expect(text).toContain("convenor@pyrmontaction.org.au");
  });

  // Verify if social media links are correct (facebook & insta)
  it("contains social media links", () => {
    const facebook = wrapper.find(".facebook");
    const instagram = wrapper.find(".instagram");
    expect(facebook.attributes("href")).toBe(
      "https://www.facebook.com/people/Pyrmont-Action/100066510758084/#"
    );
    expect(instagram.attributes("href")).toBe("https://www.instagram.com/pyrmontaction/");
  });
});
