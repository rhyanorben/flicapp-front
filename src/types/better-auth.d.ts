declare module "better-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
    };
  }
}

declare module "better-auth/react" {
  
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
    };
  }
}
