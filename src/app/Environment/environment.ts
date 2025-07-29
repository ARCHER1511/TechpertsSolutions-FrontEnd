export class Environment {
  // Remove the trailing slash here!
  static baseUrl: string = 'https://localhost:7230/api';
  
  // Development settings
  static isDevelopment: boolean = true;
  static bypassSSLVerification: boolean = true; // Only for development
}
