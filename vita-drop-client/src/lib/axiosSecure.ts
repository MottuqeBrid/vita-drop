import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;
console.log(baseURL);

// 🔧 Custom config type to support _retry flag
interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// 🔁 Queue item structure for failed requests
interface FailedRequest {
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
}

const axiosSecure = axios.create({
  baseURL,
  withCredentials: true, // Cookie পাঠানোর জন্য (refresh token)
});

// 🔐 Request interceptor → Add access token to header
axiosSecure.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// 🔁 Response interceptor → Auto-refresh token if access token expires
let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: AxiosError | null, token: string | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosSecure.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomInternalAxiosRequestConfig;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/users/login") &&
      !originalRequest.url?.includes("/refresh")
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosSecure(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const res = await axios.post<{ accessToken: string }>(
          `${baseURL}/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = res.data.accessToken;
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", newToken);
        }

        axiosSecure.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newToken}`;
        processQueue(null, newToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        return axiosSecure(originalRequest);
      } catch (err: unknown) {
        processQueue(err as AxiosError, null);
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          window.location.href = "/login"; // redirect if refresh failed
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosSecure;
