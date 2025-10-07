import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import ContactFormSection from "../../frontend/src/features/contact/components/ContactFormSection.vue";

vi.mock("../../frontend/src/features/contact/services/contactServices", () => ({
  default: {
    sendInquiry: vi.fn(),
  },
}));

import contactUsAPIServices from "../src/features/contact/services/contactServices";

describe("ContactFormSection.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(ContactFormSection);
  });

  // Verify form fields rendering
  it("renders form fields correctly", () => {
    expect(wrapper.find("#firstName").exists()).toBe(true);
    expect(wrapper.find("#lastName").exists()).toBe(true);
    expect(wrapper.find("#email").exists()).toBe(true);
    expect(wrapper.find("#message").exists()).toBe(true);
  });

});