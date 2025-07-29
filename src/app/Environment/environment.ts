export class Environment {
  static useHttps: boolean = true; // Set to true for HTTPS, false for HTTP
  static httpBaseUrl: string = 'http://localhost:7230/api';
  static httpsBaseUrl: string = 'https://localhost:7230/api';

  static get baseUrl(): string {
    return this.useHttps ? this.httpsBaseUrl : this.httpBaseUrl;
  }

  static isDevelopment: boolean = true;
  static bypassSSLVerification: boolean = true; // Only for development
}
