export interface UserRegister {
  user_name: str;
  user_login: str;
  user_email: string;
  user_pass: string;
  is_master?: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}