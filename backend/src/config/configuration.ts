export interface AppConfig {
  port: number;
  nodeEnv: string;
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };
  cloudinary: {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};
}

export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),

  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? '3306', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },

cloudinary: {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  apiKey: process.env.CLOUDINARY_API_KEY || '',
  apiSecret: process.env.CLOUDINARY_API_SECRET || '',
},
});
