/*
 * @Author: Bin
 * @Date: 2021-11-15
 * @FilePath: /so.jszkk.com/src/api/axios.ts
 */
import axios from "axios";
import { UserStore } from '../stores'

import Config from '../config'
import { configure } from "axios-hooks";

const initAxios = () => {
    axios.defaults.baseURL = Config.serverURL || '';
    axios.defaults.headers.common['Authorization'] = `Bearer ${UserStore.me?.access_token || ''}`;
    axios.interceptors.response.use((data: any) => {
        if (data?.data?.code === 401) {
            UserStore.loginOut();
        }
        return data;
    });

    // 将 axios 对象配置到 axios-hooks
    configure({ axios });

    // console.log("接口拿到的用户", toJS(UserStore));
}

const apiAxios = { initAxios }
export default apiAxios;
export { initAxios }