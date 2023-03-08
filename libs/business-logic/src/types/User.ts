type User = {
  id: string;
  name: string;
  email: string;
  authProvider: 'google' | 'email';
  messagingTokens: string[];
};

export default User;
