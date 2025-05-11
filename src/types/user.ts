export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  phone: string;
  profilePicture: string;
  role: 'user' | 'admin';
  address: {
    street: string;
    city: string;
    zip: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}
