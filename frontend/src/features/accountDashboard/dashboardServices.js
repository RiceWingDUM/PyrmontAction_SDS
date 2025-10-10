import api from "../../services/api"

const dashboardServices = {    
    getCurrentUserDetails(token){ return api.get("api/users/me", token);},
    updateCurrentUser(token, userData){ return api.put("api/users/me", userData, token);},
    getAllMeetingMinutes(token){ return api.get("api/minutes/", token);},
    getPublishedMeetingMinutes(token){ return api.get("api/minutes/published", token);},
    createMeetingMinute(token, formData){ return api.postFormData("api/minutes/", formData, token);},
    updateMeetingMinute(token, id, data){ return api.put(`api/minutes/${id}`, data, token);},
    publishMeetingMinute(token, id, data){ return api.patch(`api/minutes/${id}/publish`, data, token);},
    deleteMeetingMinute(token, id){ return api.delete(`api/minutes/${id}`, token);}
}

export default dashboardServices;