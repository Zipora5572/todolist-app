import jwt_decode from "jwt-decode";
import axios from '../axiosConfig'


setAuthorizationBearer();

function saveAccessToken(authResult) {
  localStorage.setItem("access_token", authResult.token);
  setAuthorizationBearer();
}

function setAuthorizationBearer() {
  const accessToken = localStorage.getItem("access_token");
  if (accessToken) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  }
}

axios.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    if (error.response.status === 401) {
      return (window.location.href = "/login");
    }
    return Promise.reject(error);
  }
);

export default {
  getLoginUser: () => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      return jwt_decode(accessToken);
    }
    return null;
  },

  logout:()=>{
    localStorage.setItem("access_token", "");
  },

  register: async (name, password) => {
    const res = await axios.post("api/auth/register",{ UserName: name, Password: password });
    saveAccessToken(res.data);
  },

  login: async (name, password) => {
    const res = await axios.post("/api/auth/login", { UserName: name, Password: password });
    saveAccessToken(res.data);
  },

  
  
};
