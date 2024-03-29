/*
 * @Author: Bin
 * @Date: 2021-11-11
 * @FilePath: /so.jszkk.com/src/stores/UserStore.ts
 */
import { makeAutoObservable, observable, action } from "mobx";
import * as Storage from './localStorage'

import { initAxios, axios } from '../api'

class UserStore {
    @observable me: any;
    
    constructor() {
        const user = Storage.getItem('me');
        user?.then((u: any) => {
            // console.log('用户', u);
            this.setMe(u);
        });
        makeAutoObservable(this);
    }

    @action.bound
    login(user: any) {
        this.setMe(user);
        Storage.setItem('me', this.me);
    }

    @action.bound
    loginOut() {
        this.me = undefined;
        Storage.removeItem('me');
    }

    @action.bound
    setMe(user: any) {
        this.me = user;
        initAxios();
        Storage.setItem('me', this.me);
    }

    @action.bound
    updateInfo() {
        axios.post('/api/auth/me').then((res: any) => {
            const { code, data } = res?.data;
            if (code === 200 && data) {
                // console.log("用户数据", data);
                this.setMe({
                    ...this.me,
                    ...data
                });
            }
        })
    }

}

export default new UserStore();