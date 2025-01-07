type BrokerRequest = ({ cache: true; key: keyof AppCache } | { cache: false }) & {
   action: (meta?: Metadata) => Promise<any> | any;
   app?: EApp;
   onClientFinished: (success: boolean, meta: Metadata) => void;
   ctx: RequestContext;
};
