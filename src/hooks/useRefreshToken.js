import axios from 'axios';
import { useSession } from 'src/provider/sessionProvider';

const useRefreshToken = () => {
  const { setAccessToken } = useSession();
  const refresh = async () => {
    const response = await axios.get(`${process.env.REACT_APP_URL_LOC}/user/refresh`, {
      withCredentials: true,
    });

    setAccessToken(response.data.accessToken);
    return response.data.accessToken;
  };

  return refresh;
};

export default useRefreshToken;
