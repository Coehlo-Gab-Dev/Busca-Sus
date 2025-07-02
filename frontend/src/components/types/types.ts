
export interface HealthUnit {
  id: string;
  displayName?: {
    text: string;
  };
  formattedAddress?: string;
  nationalPhoneNumber?: string;
}
export interface User {
  username?: string;
  email?: string;
}
