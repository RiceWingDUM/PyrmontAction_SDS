import api from "../../services/api"

const editorialServices = {    
    // Project Management (following meeting minutes pattern)
    getAllProjects(token){ return api.get("api/projects/", token);},
    createProject(token, formData){ return api.postFormData("api/projects/", formData, token);},
    updateProject(token, id, data){ return api.put(`api/projects/${id}`, data, token);},
    updateProjectWithFile(token, id, formData){ return api.putFormData(`api/projects/${id}/upload`, formData, token);},
    deleteProject(token, id){ return api.delete(`api/projects/${id}`, token);},
}

export default editorialServices;