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

});