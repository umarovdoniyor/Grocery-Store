import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { MockEndPoints } from "__server__";

// Axios instance
const axiosInstance = axios.create({
  // baseURL: "http://localhost:3000",
  // Axios configuration options here
});

const enableMocks = process.env.NEXT_PUBLIC_ENABLE_MOCKS === "true";
if (enableMocks) {
  const mock = new MockAdapter(axiosInstance);
  const enableDashboardMocks = process.env.NEXT_PUBLIC_ENABLE_DASHBOARD_MOCKS === "true";
  MockEndPoints(mock, { enableDashboardMocks });
}

export default axiosInstance;
