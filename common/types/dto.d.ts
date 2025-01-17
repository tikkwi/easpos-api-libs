type BrokerRequest = ({ cache?: true; key: keyof AppCache } | { cache?: false }) & {
   action: (meta?: Metadata) => any;
   meta?: Metadata;
   app?: EApp;
};
