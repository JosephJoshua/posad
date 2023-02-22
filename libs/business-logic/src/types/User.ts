type User = {
  id: string;
  name: string;
  email: string;
  authProvider: 'google' | 'email';
};

export default User;
