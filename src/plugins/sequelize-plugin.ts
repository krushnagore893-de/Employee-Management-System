import { Sequelize } from 'sequelize';
import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

// Extend Fastify's interface to include Sequelize and connection methods
declare module 'fastify' {
  interface FastifyInstance {
    sequelize: Sequelize & {
      checkConnection(): Promise<{
        status: 'connected' | 'disconnected' | 'error';
        message: string;
        timestamp: Date;
      }>;
      testConnection(): Promise<void>;
      getConnectionStatus(): {
        isConnected: boolean;
        lastConnected?: Date;
        lastError?: Error;
      };
    };
  }
}

// Define plugin options interface
interface SequelizePluginOptions {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
  dialect?: 'mysql' | 'postgres' | 'sqlite' | 'mssql';
  logging?: boolean | ((sql: string) => void);
  connectionTimeout?: number;
  reconnect?: {
    max?: number;
    delay?: number;
  };
}

// Extend Sequelize with custom connection methods
class ExtendedSequelize extends Sequelize {
  private _connectionStatus = {
    isConnected: false,
    lastConnected: undefined as Date | undefined,
    lastError: undefined as Error | undefined
  };

  async checkConnection() {
    const startTime = Date.now();
    try {
      await this.authenticate();
      
      const connectionTime = Date.now() - startTime;
      this._connectionStatus = {
        isConnected: true,
        lastConnected: new Date(),
        lastError: undefined
      };

      return {
        status: 'connected' as const,
        message: `Database connected successfully. Latency: ${connectionTime}ms`,
        timestamp: new Date()
      };
    } catch (error) {
      this._connectionStatus = {
        isConnected: false,
        lastConnected: this._connectionStatus.lastConnected,
        lastError: error instanceof Error ? error : new Error(String(error))
      };

      return {
        status: 'error' as const,
        message: `Database connection failed: ${error instanceof Error ? error.message : String(error)}`,
        timestamp: new Date()
      };
    }
  }

  async testConnection(timeout = 5000) {
    return new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Connection test timed out'));
      }, timeout);

      this.authenticate()
        .then(() => {
          clearTimeout(timer);
          resolve();
        })
        .catch((error) => {
          clearTimeout(timer);
          reject(error);
        });
    });
  }

  getConnectionStatus() {
    return { ...this._connectionStatus };
  }
}

// Singleton pattern for accessing sequelize instance outside of Fastify context
let sequelizeInstance: ExtendedSequelize;

export function initializeSequelizeInstance(instance: ExtendedSequelize) {
  sequelizeInstance = instance;
}

export function getSequelize(): ExtendedSequelize {
  if (!sequelizeInstance) {
    throw new Error('Sequelize instance not initialized. Make sure database connection is established.');
  }
  return sequelizeInstance;
}

// Sequelize Fastify Plugin
const sequelizePlugin: FastifyPluginAsync<SequelizePluginOptions> = fp(async (fastify, options: any) => {
 
  const sequelize = new ExtendedSequelize({
    host: options?.host || process.env.DATABASE_HOST || 'localhost',
    port: options?.port || parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: options?.username || process.env.DATABASE_USERNAME || 'postgres', // ✅ Fixed key
    password: options?.password || process.env.DATABASE_PASSWORD || '',
    database: options?.database || process.env.DATABASE_NAME || '',
    dialect: options?.dialect || 'mysql',
    logging: options?.logging || false,
     dialectOptions: process.env.DB_SSL_REQUIRED == 'true' ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }  
    } : {},
    define: {
      timestamps: false,
      underscored: true
    },
    pool: {
      max: 300,
      min: 0,
      acquire: options.connectionTimeout || 150000,
      idle: 40000
    },
    retry: {
      max: options.reconnect?.max || 3,
      backoffBase: options.reconnect?.delay || 1000
    }
  });

  try {
    const connectionResult = await sequelize.checkConnection();
    fastify.log.info(connectionResult.message);

    initializeSequelizeInstance(sequelize);
    fastify.decorate('sequelize', sequelize);

    fastify.addHook('onClose', async () => {
      await sequelize.close();
    });
  } catch (error:any) {
    fastify.log.error('Unable to connect to the database:', error);
    throw error;
  }
});


export default sequelizePlugin;