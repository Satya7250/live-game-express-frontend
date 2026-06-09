export interface UpdateProfileDto {
  name?: string;
  phone?: string;
  avatar?: string;
  address?: string;
  bio?: string;
}

export interface DeleteAccountDto {
  password: string;
}