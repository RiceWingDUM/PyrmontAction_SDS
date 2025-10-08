import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import GalleryCollage from "../../frontend/src/features/gallery/components/GalleryCollage.vue";
import GalleryLightbox from "../../frontend/src/features/gallery/components/GalleryLightbox.vue";

describe("GalleryCollage.vue", () => {
  const mockImages = [
    { _id: "1", image_file_name: "img1.jpg", alt: "Alt text 1", caption: "Caption 1" },
    { _id: "2", image_file_name: "img2.jpg", alt: "Alt text 2", caption: "Caption 2" },
  ];

  // Test to correct rendering of images
  it("renders gallery images correctly", () => {
    const wrapper = mount(GalleryCollage, { props: { images: mockImages } });
    const images = wrapper.findAll("img");
    expect(images.length).toBe(2);
    expect(images[0].attributes("alt")).toBe("Alt text 1");
  });

  // Test to emit event on image click
  it("emits 'select-image' event when an image is clicked", async () => {
    const wrapper = mount(GalleryCollage, { props: { images: mockImages } });
    await wrapper.findAll(".collage-item")[0].trigger("click");

    const emitted = wrapper.emitted("select-image");
    expect(emitted).toBeTruthy();
    expect(emitted[0][0]).toHaveProperty("src");
  });

  // Test to use placeholder if image fails to load
  it("uses placeholder image if file not found in import map", async () => {
    const wrapper = mount(GalleryCollage, { props: { images: mockImages } });
    const img = wrapper.find("img");
    await img.trigger("error");
    expect(img.attributes("src")).toContain("placeholder.png");
  });
});

describe("GalleryLightbox.vue", () => {
  const mockImage = {
    src: "/images/test.jpg",
    alt: "Test Image",
    caption: "Sample caption",
  };

  // Test to render lightbox with given image prop
  it("renders lightbox when image prop is provided", () => {
    const wrapper = mount(GalleryLightbox, { props: { image: mockImage } });
    expect(wrapper.find(".lightbox-image").exists()).toBe(true);
    expect(wrapper.text()).toContain("Sample caption");
  });

  // Test handler for image load error
  it("handles image load errors gracefully", async () => {
    const wrapper = mount(GalleryLightbox, { props: { image: mockImage } });
    const img = wrapper.find("img");
    await img.trigger("error");
    expect(img.attributes("src")).toContain("/path/to/fallback.png");
  });
});