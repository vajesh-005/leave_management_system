import {jwtDecode} from "jwt-decode";

export const Token = () => {
  const token = localStorage.getItem("token");
  try {
    const decode = token ? jwtDecode(token) : null;
    return { decode, token };
  } catch (err) {
    console.log("Invalid token:", err);
    return { decoded: null, token: null };
  }
};
    