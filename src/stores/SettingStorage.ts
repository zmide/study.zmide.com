/*
 * @Author: Bin
 * @Date: 2023-03-12
 * @FilePath: /so.jszkk.com/src/stores/SettingStorage.ts
 */
import { makeAutoObservable, observable, action } from "mobx";
import * as Storage from './localStorage'
import UserStore from "./UserStore";

class SettingStorage {
    @observable enableChatGPT: boolean | undefined;

    constructor() {
        const settings = Storage.getItem('settings');
        settings?.then((set: any) => {
            this.enableChatGPT = set?.enableChatGPT || undefined

            if(set?.enableChatGPT === undefined && UserStore.me?.is_vip) {
                // 当用户未设置是否启用 enableChatGPT 且 属于内测用户默认启用 enableChatGPT
                this.enableChatGPT = true;
            }
        });
        makeAutoObservable(this);
    }

    @action.bound
    setEnableChatGPT(enable: boolean) {
        this.enableChatGPT = enable;
        Storage.setItem('settings', this);
    }

    @action.bound
    getEnableChatGPT(): boolean {
        if (this.enableChatGPT) {
            return true;
        } 
        return false;
    }

}

export default new SettingStorage();