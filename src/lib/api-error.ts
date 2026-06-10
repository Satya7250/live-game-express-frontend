import { isAxiosError } from "axios";

interface ApiErrorBody {
  message?: string;
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong"
): string {
  if (isAxiosError<ApiErrorBody>(error)) {
    if (error.response?.status === 401) {
      return (
        error.response.data?.message ||
        "Your session has expired. Please log in again."
      );
    }

    if (!error.response) {
      return "Network error. Please check your connection and try again.";
    }

    return error.response.data?.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
