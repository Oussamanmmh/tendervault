import axios from "axios";
import { useQuery } from "@tanstack/react-query";



const AuthAPI = () => {
  if (typeof window !== "undefined") {
    return axios.create({
      baseURL: `http://localhost:5000/v1/`,
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
  } else {
    return axios.create({
      baseURL: `http://localhost:5000/v1/`,
      headers: {
        authorization: `Bearer }`,
        "Content-Type": "application/json",
      },
    });
  }
};
const GetMyDetails = async () => {
  const { data } = await AuthAPI().get("/user/my-details");
  return data;
};
const GetUserDetails = async (userId) => {
  const { data } = await AuthAPI().get(`/user/user-details/${userId}`);
  return data;
};
const GetMyDetailsQuery = () =>
  useQuery({
    queryKey: ["my-details"],
    queryFn: () => GetMyDetails(),
    select: (data) => {
      const res = data.message;
      return res;

    },
  });
const GetUserQuery = (userId) =>
  useQuery({
    queryKey: [`user-details-${userId}`],
    queryFn: () => GetUserDetails(userId),
    select: (data) => {
      const res = data.message;
      return res;

    },
  });
const GetVendor = async () => {
  const { data } = await AuthAPI().get("/user/getvendors");
  return data;
};
const GetVendorQuery = () =>
  useQuery({
    queryKey: ["getvendor"],
    queryFn: () => GetVendor(),
    select: (data) => {
      const res = data.message;
      return res;

    },
  });
const GetCompany = async () => {
  const { data } = await AuthAPI().get("/user/getcompany");
  return data;
};
const GetCompanyQuery = () =>
  useQuery({
    queryKey: ["getcompany"],
    queryFn: () => GetCompany(),
    select: (data) => {
      const res = data.message;
      return res;

    },
  });

export { GetUserQuery ,GetVendorQuery,GetCompanyQuery,GetMyDetailsQuery};
