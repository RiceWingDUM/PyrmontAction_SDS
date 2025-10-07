import api from "../../../services/api"

const loginAuthentication = {    
    login(loginDetails){
        return api.post("api/auth/login", loginDetails, "")
    }
}

export default loginAuthentication;