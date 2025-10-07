import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Carousel from "../../frontend/src/features/home/components/Carousel.vue";

describe("Carousel.vue - Unit Tests", () => {
  let wrapper;

  beforeEach(() => {
    // Simulate 3 slides in DOM before mounting
    document.body.innerHTML = `
      <div class="slide"></div>
      <div class="slide"></div>
      <div class="slide"></div>
    `;
    wrapper = mount(Carousel);
    wrapper.vm.getSlideCount.value = 3;
  });
});