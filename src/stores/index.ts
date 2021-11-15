/*
 * @Author: Bin
 * @Date: 2021-11-11
 * @FilePath: /so.jszkk.com/src/stores/index.ts
 */

import React from 'react'
import UserStore from './UserStore'
import * as Storage from './localStorage'

const storesContext = React.createContext({
    userStore: UserStore,
});

export * from 'mobx';
export const useStores = () => React.useContext(storesContext);
export { Storage, UserStore }