import { googleLogin } from "../api/auth.api";

/**
 * Trigger official Google OAuth login popup using Google Identity Services (GIS)
 */
export const triggerGoogleAuth = ({ onSuccess, onError, onRequiresConfig }) => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId || clientId.trim() === "" || clientId.includes("YOUR_GOOGLE_CLIENT_ID")) {
    if (onRequiresConfig) {
      onRequiresConfig();
    } else {
      onError?.("Chưa cấu hình VITE_GOOGLE_CLIENT_ID trong file .env");
    }
    return;
  }

  if (!window.google?.accounts?.oauth2) {
    onError?.("Thư viện Google Identity Services chưa tải xong. Vui lòng thử lại sau vài giây.");
    return;
  }

  try {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId.trim(),
      scope: "email profile openid",
      callback: async (tokenResponse) => {
        if (tokenResponse?.error) {
          onError?.(tokenResponse.error_description || tokenResponse.error);
          return;
        }

        if (tokenResponse?.access_token) {
          try {
            const res = await googleLogin({ accessToken: tokenResponse.access_token });
            onSuccess?.(res.data);
          } catch (err) {
            onError?.(
              err?.response?.data?.message ||
              err?.message ||
              "Đăng nhập với Google thất bại. Vui lòng thử lại!"
            );
          }
        }
      },
    });

    tokenClient.requestAccessToken({ prompt: "select_account" });
  } catch (err) {
    onError?.(err?.message || "Lỗi khi kích hoạt popup Google.");
  }
};
