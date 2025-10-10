import api from "../../services/api"

const dashboardServices = {    
    getCurrentUserDetails(token){ return api.get("api/users/me", token);},
    updateCurrentUser(token, userData){ return api.put("api/users/me", userData, token);},
    
    // Meeting Minutes Management
    getAllMeetingMinutes(token){ return api.get("api/minutes/", token);},
    getPublishedMeetingMinutes(token){ return api.get("api/minutes/published", token);},
    createMeetingMinute(token, formData){ return api.postFormData("api/minutes/", formData, token);},
    updateMeetingMinute(token, id, data){ return api.put(`api/minutes/${id}`, data, token);},
    updateMeetingWithFile(token, id, formData){ return api.putFormData(`api/minutes/${id}/upload`, formData, token);},
    publishMeetingMinute(token, id, data){ return api.patch(`api/minutes/${id}/publish`, data, token);},
    deleteMeetingMinute(token, id){ return api.delete(`api/minutes/${id}`, token);}

    // Project Management
}

export default dashboardServices;