declare module "better-auth" {
  interface User {
    role: string;
  }
  
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      role: string;
    };
  }
}

declare module "better-auth/react" {
  interface User {
    role: string;
  }
  
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      role: string;
    };
  }
}
