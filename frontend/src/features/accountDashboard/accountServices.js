import api from "../../services/api"

const accountServices = {    
    getCurrentUserDetails(token){ return api.get("api/users/me", token);},
    updateCurrentUser(token, userData){ return api.put("api/users/me", userData, token);},
}

export default accountServices;