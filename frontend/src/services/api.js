import axios from 'axios';

const server = "https://pyrmontactionsds-production.up.railway.app";

const api = {
    async get(endpoint, token) {
        try {
            const response = await axios.get(`${server}/${endpoint}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error caused from GET Request: ' + error);
            throw error;
        }
    },

    async post(endpoint, data, token) {
        try {
            const response = await axios.post(`${server}/${endpoint}`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error caused from POST Request: ' + error);
            throw error;
        }
    },

    async put(endpoint, data, token) {
        try {
            const response = await axios.put(`${server}/${endpoint}`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error caused from PUT Request: ' + error);
            throw error;
        }
    },

    async patch(endpoint, data, token) {
        try {
            const response = await axios.patch(`${server}/${endpoint}`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error caused from PATCH Request: ' + error);
            throw error;
        }
    },

    async delete(endpoint, token) {
        try {
            const response = await axios.delete(`${server}/${endpoint}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return true;
        } catch (error) {
            console.error('Error caused from DELETE Request: ' + error);
            throw error;
        }
    },

    async postFormData(endpoint, formData, token) {
        try {
            const response = await axios.post(`${server}/${endpoint}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error caused from FormData POST Request: ' + error);
            throw error;
        }
    },

    async putFormData(endpoint, formData, token) {
        try {
            const response = await axios.put(`${server}/${endpoint}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error caused from FormData PUT Request: ' + error);
            throw error;
        }
    },
};

export default api;
