import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import ProjectCardGrid from "../../frontend/src/features/projects/components/ProjectsCardGrid.vue";

describe("ProjectCardGrid.vue - Filtering Logic", () => {
  const mockProjects = [
    { _id: 1, project_name: "Park Revitalization", project_description: "Improving local parks", project_image: "park.jpg", project_type: "open" },
    { _id: 2, project_name: "Harbour Cleanup", project_description: "Cleaning Sydney Harbour", project_image: "harbour.jpg", project_type: "closed" },
    { _id: 3, project_name: "Urban Tree Planting", project_description: "Planting trees around Pyrmont", project_image: "tree.jpg", project_type: "open" },
  ];

  // Verify all projects render by default
  it("renders all projects by default", () => {
    const wrapper = mount(ProjectCardGrid, {
      props: { projects: mockProjects },
    });
    expect(wrapper.findAll(".project-card").length).toBe(3);
  });

  // Verify filtering by project search term
  it("filters projects by search term in name", async () => {
    const wrapper = mount(ProjectCardGrid, { props: { projects: mockProjects } });
    const input = wrapper.find("input");
    await input.setValue("harbour");

    const filtered = wrapper.vm.filteredProjects();
    expect(filtered.length).toBe(1);
    expect(filtered[0].project_name).toBe("Harbour Cleanup");
  });
});