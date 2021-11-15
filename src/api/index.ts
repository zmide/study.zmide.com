/*
 * @Author: Bin
 * @Date: 2021-11-15
 * @FilePath: /so.jszkk.com/src/api/index.js
 */
import axiosInstance, { initAxios } from './axios'

const instance = axiosInstance;

export * from 'axios';
export { default as axios } from 'axios';
export { axiosInstance, initAxios }