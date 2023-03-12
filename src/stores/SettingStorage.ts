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
    @observable showDeveloperSlogan: boolean | undefined;
    @observable showChatGPTHint: boolean | undefined;

    constructor() {
        const settings = Storage.getItem('settings');
        settings?.then((set: any) => {
            this.enableChatGPT = set?.enableChatGPT || undefined
            this.showDeveloperSlogan = set?.showDeveloperSlogan === undefined ? true : set?.showDeveloperSlogan 
            this.showChatGPTHint = set?.showChatGPTHint === undefined ? true : set?.showChatGPTHint 

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

    @action.bound
    setShowDeveloperSlogan(enable: boolean) {
        this.showDeveloperSlogan = enable;
        Storage.setItem('settings', this);
    }
    
    @action.bound
    setShowChatGPTHint(enable: boolean) {
        this.showChatGPTHint = enable;
        Storage.setItem('settings', this);
    }
    
}

export default new SettingStorage();