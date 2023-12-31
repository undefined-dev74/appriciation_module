import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: 'https://teamworks.teamcomputers.com/API/API/',
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Modify request config as needed
    // For example, you can add headers or authentication tokens
    // before the request is sent

    // Add headers or other modifications to the config
    // config.headers = { ... };
    if (localStorage.getItem('token')) {
      config.headers['auth-token'] = localStorage.getItem('token');
      config.headers['businessUnit'] = 'EUS,MPS';
    }
    return config;
  },
  (error: any): Promise<any> => {
    // Handle request error
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    // Modify response data as needed
    // For example, you can extract and transform the data
    // before it is passed to the calling code

    // Transform the response data if necessary
    // response.data = { ... };

    return response;
  },
  (error: any): Promise<any> => {
    // Handle response error
    if (
      error.config.url !== 'user/login' &&
      error.response?.status === 401 &&
      !error.config._retry
    ) {
      // Access token was expired
      error.config._retry = false;
      // Rest of the code logic
      window.location.href = '/session-expired';
    }
    return Promise.reject(error);
  },
);

export { apiClient };
