type BrokerRequest = ({ cache: true; key: string } | { cache: false }) & {
   action: (meta?: Metadata) => Promise<any> | any;
   app?: EApp;
};
