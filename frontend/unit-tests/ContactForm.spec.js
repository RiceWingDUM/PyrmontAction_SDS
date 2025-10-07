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

  // Confirm that contact form submission failure shows error message
  it("shows success message when form submission succeeds", async () => {
    contactUsAPIServices.sendInquiry.mockResolvedValueOnce({ ok: true });

    await wrapper.find("#firstName").setValue("John");
    await wrapper.find("#lastName").setValue("Doe");
    await wrapper.find("#email").setValue("john@example.com");
    await wrapper.find("#message").setValue("Hello, this is a test!");

    await wrapper.find("form").trigger("submit.prevent");
    await new Promise((r) => setTimeout(r, 10));

    expect(wrapper.vm.submitted).toBe(true);
    expect(wrapper.find(".success-message").exists()).toBe(true);
  });
});