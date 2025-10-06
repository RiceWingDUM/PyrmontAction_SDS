import { describe, it, expect } from "vitest";
// import { mount } from "@vue/test-utils";
// import JoinUsForm from "@/features/JoinUs/components/JoinUsForm.vue";

// import { expect } from "chai";
import { mount } from "@vue/test-utils";
import JoinUsForm from "../src/features/JoinUs/components/JoinUsForm.vue";
import { createRouter, createWebHistory } from "vue-router"; // <-- Add this line

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/login", component: { template: "<div>Login</div>" } },
  ],
});

describe("JoinUsForm.vue - Sign Up Form Validation", () => {
  it("marks password rules correctly", async () => {
    const wrapper = mount(JoinUsForm, {
      global: {
        plugins: [router],
      },
    });

    // const wrapper = mount(JoinUsForm);

    // weak password
    await wrapper.find("#password").setValue("weak");
    expect(wrapper.vm.passwordValidator.minlength).to.equal(false);
    expect(wrapper.vm.passwordValidator.uppercase).to.equal(false);

    // strong password
    await wrapper.find("#password").setValue("ValidPass123!");
    expect(wrapper.vm.passwordValidator.minlength).to.equal(true);
    expect(wrapper.vm.passwordValidator.uppercase).to.equal(true);
    expect(wrapper.vm.passwordValidator.lowercase).to.equal(true);
    expect(wrapper.vm.passwordValidator.number).to.equal(true);
    expect(wrapper.vm.passwordValidator.symbols).to.equal(true);
  });

  // Email input updates reactive state
  it("updates email field correctly", async () => {
    const wrapper = mount(JoinUsForm, {
      global: { plugins: [router] },
    });

    const emailInput = wrapper.find("#email");
    await emailInput.setValue("test@example.com");

    // Assert by checking the DOM input value (realistic for E2E-style unit)
    expect(emailInput.element.value).toBe("test@example.com");
  });

  // State dropdown default & selection
  it("defaults state to 'Default' and changes when selected", async () => {
    const wrapper = mount(JoinUsForm);

    expect(wrapper.vm.stateChosen).to.equal("Default");

    await wrapper.find("#state").setValue("NSW");
    expect(wrapper.vm.stateChosen).to.equal("NSW");
  });
});
