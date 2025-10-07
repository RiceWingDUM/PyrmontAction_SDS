import api from "../../../services/api"


const joinUsAuthenticationService = {
    joinus(userDetails){
        return api.post("api/auth/join", userDetails, "")
    }
}

export default joinUsAuthenticationService;