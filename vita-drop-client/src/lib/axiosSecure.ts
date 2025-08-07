import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
// import Router from "next/router";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

// ✅ Extended config to track retries
interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// ✅ Queue for waiting requests while refreshing
interface FailedRequest {
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
}

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

const axiosSecure = axios.create({
  baseURL,
  withCredentials: true, // Needed for cookies
});

// 🔹 Request Interceptor → Attach access token
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

// 🔹 Response Interceptor → Handle token refresh
axiosSecure.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (!error.config) return Promise.reject(error);
    const originalRequest = error.config as CustomInternalAxiosRequestConfig;

    // Handle only 401 (Unauthorized) or 403 (Forbidden)
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/login") &&
      !originalRequest.url?.includes("/refreshToken")
    ) {
      originalRequest._retry = true;

      // Wait if refresh already happening
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
        // ✅ Call backend refresh endpoint
        const res = await axios.post<{ accessToken: string }>(
          `${baseURL}/users/refreshToken`,
          {},
          { withCredentials: true }
        );

        const newToken = res.data.accessToken;

        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", newToken);
        }

        axiosSecure.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        return axiosSecure(originalRequest);
      } catch (err) {
        processQueue(err as AxiosError, null);

        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          // Router.push("/login");
          window.location.href = "/login";
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
