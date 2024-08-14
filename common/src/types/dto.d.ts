type BrokerRequest = ({ cache: true; key: string } | { cache: false }) & {
   basicAuth: boolean;
   action: (meta?: Metadata) => Promise<any> | any;
   app?: EApp;
};
