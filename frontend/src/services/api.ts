import axios from "axios";

import { API_BASE_URL } from "../lib/config";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { message?: string } | undefined)?.message ??
        (error.code === "ERR_NETWORK"
          ? "Unable to reach the server. Please check that the backend is running."
          : error.message) ??
        "An unexpected error occurred.";

      return Promise.reject(new Error(message));
    }

    return Promise.reject(
      error instanceof Error
        ? error
        : new Error("An unexpected error occurred.")
    );
  }
);

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "An unexpected error occurred.";
}