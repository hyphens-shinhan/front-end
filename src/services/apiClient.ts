import axios from 'axios';
import { createClient } from '@/utils/supabase/client';

// 1. Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. 요청 인터셉터 설정 (통행증 자동 주입)
apiClient.interceptors.request.use(
  async (config) => {
    // FormData인 경우 Content-Type을 제거해 axios가 multipart/form-data; boundary=... 로 설정하게 함
    // (기본 application/json 이면 서버가 파일을 받지 못해 422 발생)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    // 브라우저용 Supabase 클라이언트 호출
    const supabase = createClient();
    
    // 현재 세션 정보 가져오기 (만료 시 자동 갱신 시도함)
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (token) {
      // 헤더에 Bearer 토큰 주입
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;