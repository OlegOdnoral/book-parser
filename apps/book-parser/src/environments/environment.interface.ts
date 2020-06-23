export interface EnvironmentI {
    production: boolean;
    rabbitUri: string;
    rabbitUser: string;
    rabbitPassword: string;
    rabbitQueueName: string;
}