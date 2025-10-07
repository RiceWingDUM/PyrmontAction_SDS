import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import GalleryCollage from "../../frontend/src/features/gallery/components/GalleryCollage.vue";

describe("GalleryCollage.vue", () => {
  const mockImages = [
    { _id: "1", image_file_name: "img1.jpg", alt: "Alt text 1", caption: "Caption 1" },
    { _id: "2", image_file_name: "img2.jpg", alt: "Alt text 2", caption: "Caption 2" },
  ];

});