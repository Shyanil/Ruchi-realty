import { createContext, useContext } from 'react';

const ServerDataContext = createContext({});
export const ServerDataProvider = ServerDataContext.Provider;
export const useServerData = () => useContext(ServerDataContext);
