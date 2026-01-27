import { apiClient } from "../api/client";

let currentToken: string | null = null;

export function setAuthToken(token: string | null) {
  currentToken = token;

  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
}

export function getAuthToken() {
  return currentToken;
}
