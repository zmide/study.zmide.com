/*
 * @Author: Bin
 * @Date: 2021-11-15
 * @FilePath: /so.jszkk.com/src/api/axios.ts
 */
import axios, { AxiosRequestConfig, AxiosInstance } from "axios";
import { UserStore, toJS } from '../stores'

import Config from '../config'
import { configure } from "axios-hooks";

const initAxios = () => {
    axios.defaults.baseURL = Config.serverURL || '';
    axios.defaults.headers.common['Authorization'] = `Bearer ${UserStore.me?.accessToken || ''}`;
    axios.interceptors.response.use((data: any) => {
        if (data?.data?.errCode === "401" || data?.data?.errCode === "403") {
            // 判断用户请求异常，token 非法和失效是 errCode 是 401 无权限访问是 403（操作退出登录）
            UserStore.loginOut();
        }
        return data;
    });

    // 将 axios 对象配置到 axios-hooks
    configure({ axios });

    // console.log("接口拿到的用户", toJS(UserStore));
}

export default {};
export { initAxios }