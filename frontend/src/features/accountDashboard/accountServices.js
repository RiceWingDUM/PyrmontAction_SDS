import api from "../../services/api"

const accountServices = {    
    getCurrentUserDetails(token){ return api.get("api/users/me", token);},
}

export default accountServices;