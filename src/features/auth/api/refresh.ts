import axiosInstance from '../../../api/axiosInstance';

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
}

/**
 * Call the Refresh Token API endpoint.
 * @param refreshToken The refresh token to use for getting new tokens
 * @returns New access token and refresh token
 */
export const refreshTokens = async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await axiosInstance.post<RefreshTokenResponse>('/auth/refresh', {
        refreshToken,
    });
    return response.data;
};
