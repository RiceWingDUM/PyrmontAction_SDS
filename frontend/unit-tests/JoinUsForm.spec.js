// import { describe, it, expect } from "vitest";
// import { mount } from "@vue/test-utils";
// import JoinUsForm from "@/features/JoinUs/components/JoinUsForm.vue";

// describe("JoinUsForm.vue", () => {
//     describe("Password validation", () => {
//         it("marks password rules correctly", async () => {
//             const wrapper = mount(JoinUsForm);

//             // set weak password
//             await wrapper.find("#password").setValue("weak");
//             expect(wrapper.vm.passwordValidator.minlength).toBe(false);
//             expect(wrapper.vm.passwordValidator.uppercase).toBe(false);
//         });
//     });
// });

import { expect } from "chai";
import { mount } from "@vue/test-utils";
import JoinUsForm from "../../frontend/src/features/JoinUs/components/JoinUsForm.vue";

describe("JoinUsForm.vue - Password Validation", () => {
  it("marks password rules correctly", async () => {
    const wrapper = mount(JoinUsForm);

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
});
