import axiosInstance from "./AxiosInterface";

export const getRequest = async (
  url: string = "https://intense-tor-76305.herokuapp.com/merchants"
) => {
  const serverData = await axiosInstance.get(url);
  return serverData;
};
