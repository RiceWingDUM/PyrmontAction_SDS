import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import GalleryCollage from "../../frontend/src/features/gallery/components/GalleryCollage.vue";

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
});