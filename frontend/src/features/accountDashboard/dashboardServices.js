import api from "../../services/api"

const dashboardServices = {    
    getCurrentUserDetails(token){ return api.get("api/users/me", token);},
    updateCurrentUser(token, userData){ return api.put("api/users/me", userData, token);},
    getAllMeetingMinutes(token){ return api.get("api/minutes/", token);},
    getPublishedMeetingMinutes(token){ return api.get("api/minutes/published", token);},
    createMeetingMinute(token, meetingData){ return api.post("api/minutes/upload", meetingData, token);},
    updateMeetingMinute(token, id, meetingData){ return api.put(`api/minutes/${id}`, meetingData, token);},
    publishMeetingMinute(token, id, meetingData){ return api.patch(`api/minutes/${id}/publish`, meetingData, token);},
    deleteMeetingMinute(token, id){ return api.delete(`api/minutes/${id}`, token);}
}

export default dashboardServices;