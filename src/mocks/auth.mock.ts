import type {
  AuthUser,
  LoginRequest,
  LoginResponse,
} from '../features/auth/types/auth.types';

interface MockAccount {
  user: AuthUser;
  password: string;
}

const mockAccounts: MockAccount[] = [
  {
    user: {
      id: 'USR001',
      name: 'Fredrick Pardosi',
      username: 'user',
      email: 'fredrick@mahadafinance.co.id',
      roles: ['USER'],
      division: 'OPERATION',
      position: 'Operation Staff',
    },
    password: 'Demo123!',
  },

  {
    user: {
      id: 'APR001',
      name: 'Demo Approver',
      username: 'approver',
      email: 'approver@mahadafinance.co.id',
      roles: ['USER', 'APPROVER'],
      division: 'OPERATION',
      position: 'Operation Manager',
    },
    password: 'Demo123!',
  },

  {
    user: {
      id: 'PRC001',
      name: 'Demo Processor',
      username: 'processor',
      email: 'processor@mahadafinance.co.id',
      roles: ['USER', 'PROCESSOR'],
      division: 'IT',
      position: 'IT Staff',
      processorModules: ['IT_REQUEST'],
    },
    password: 'Demo123!',
  },

  {
    user: {
      id: 'ADM001',
      name: 'Demo Admin',
      username: 'admin',
      email: 'admin@mahadafinance.co.id',
      roles: ['USER', 'ADMIN'],
      division: 'IT',
      position: 'System Administrator',
    },
    password: 'Demo123!',
  },
];

export const mockLogin = async (
  request: LoginRequest,
): Promise<LoginResponse> => {
  await new Promise((resolve) => {
    setTimeout(resolve, 700);
  });

  const identifier = request.identifier
    .trim()
    .toLowerCase();

  const account = mockAccounts.find(
    ({ user }) =>
      user.username.toLowerCase() === identifier ||
      user.email.toLowerCase() === identifier,
  );

  if (!account || account.password !== request.password) {
    throw new Error(
      'Email/username atau password tidak sesuai',
    );
  }

  return {
    accessToken: `mock-access-token-${account.user.id}`,
    user: account.user,
  };
};