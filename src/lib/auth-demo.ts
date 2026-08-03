export interface DemoUser {
  email: string;
  password: string;
  createdAt: string;
}

export interface DemoSession {
  user: {
    email: string;
  };
}

const USERS_KEY = 'luma_demo_users';
const SESSION_KEY = 'luma_demo_session';

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const readUsers = (): DemoUser[] => {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as DemoUser[]) : [];
  } catch {
    return [];
  }
};

const writeUsers = (users: DemoUser[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const readSession = (): DemoSession | null => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as DemoSession) : null;
  } catch {
    return null;
  }
};

const writeSession = (session: DemoSession | null) => {
  if (typeof window === 'undefined') return;

  if (!session) {
    window.localStorage.removeItem(SESSION_KEY);
    return;
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const getDemoSession = () => readSession();

export const signUpDemo = async (email: string, password: string) => {
  const normalizedEmail = normalizeEmail(email);
  const users = readUsers();

  if (!normalizedEmail || !password) {
    throw new Error('Email and password are required.');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  const existing = users.some((user) => user.email === normalizedEmail);
  if (existing) {
    throw new Error('An account with this email already exists.');
  }

  users.push({
    email: normalizedEmail,
    password,
    createdAt: new Date().toISOString(),
  });

  writeUsers(users);

  return {
    data: {
      user: { email: normalizedEmail },
    },
    error: null,
  };
};

export const signInDemo = async (email: string, password: string) => {
  const normalizedEmail = normalizeEmail(email);
  const users = readUsers();
  const foundUser = users.find((user) => user.email === normalizedEmail && user.password === password);

  if (!foundUser) {
    throw new Error('Invalid email or password.');
  }

  const session: DemoSession = {
    user: {
      email: foundUser.email,
    },
  };

  writeSession(session);

  return {
    data: {
      session,
      user: session.user,
    },
    error: null,
  };
};

export const signOutDemo = async () => {
  writeSession(null);
  return { error: null };
};
