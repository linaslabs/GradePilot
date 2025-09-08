import { createContext, useState, type ReactNode } from 'react';

interface User {
  // Added user, although simple, in case I want to access anymore user info
  name: string;
  onboardingCompleted: boolean;
  degreeType: string;
}

// Define the context object that other components can access (includes everything)
interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (newUser: User, newToken: string) => void;
  logout: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>( // Create the context (initially undefined)
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Gets token from local storage or sets it as null
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('authToken'); // Use an arrow function for increased performance... though negligable in this case
  });

  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('authUser');
    // Parse the user JSON string back to object
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Function that components (like login and register) function can use to set the user's name and token
  const login = (newUser: User, newToken: string) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('authUser', JSON.stringify(newUser));
  };

  // Function to reset values
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  };

  // Returns the context.Provider as a component like this, since we can only adjust the value here instead of in the main App.js
  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
