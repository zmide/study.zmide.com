/*
 * @Author: Bin
 * @Date: 2021-11-15
 * @FilePath: /so.jszkk.com/src/views/home/index.tsx
 */

import React, { useState } from 'react';
import { InputGroup, Input, Notification, toaster, Button } from 'rsuite';
import { Search } from '@rsuite/icons';
import axios from 'axios';
import useAckee from 'use-ackee';

import { AppHead, AppFooter, ResultChatGPTItem } from 'components';
import config from 'config';
import { UserStore } from 'stores';
import SettingStorage from 'stores/SettingStorage';

function Index() {
    const [keyword, setkeyword] = useState('');
    const [queryChatGPT, setqueryChatGPT] = useState('');
    const [result, setresult] = useState<any>();

    useAckee(
        '/',
        {
            server: '//tongji.zmide.com',
            domainId: 'ae768a4b-3b79-4bc9-b2d8-b14b6c4e20ee',
        },
        {
            detailed: false,
            ignoreLocalhost: true,
            ignoreOwnVisits: true,
        }
    );

    const [searchConfig, setsearchConfig] = useState({
        netLoading: false,
    });
    const onSearch = (keyword: string) => {
        if (searchConfig?.netLoading) {
            return;
        }
        setresult(undefined);

        if (keyword.length === 0) {
            toaster.push(<Notification type="warning" header={'你还没说要查啥题目呢！'} closable />, {
                placement: 'topEnd',
            });
            return;
        }
        setsearchConfig({
            netLoading: true,
        });

        axios
            .get(config?.serverURL + '/api/open/seek', {
                params: {
                    q: keyword,
                },
            })
            .then((res: any) => {
                const { data, code, msg } = res?.data;

                setsearchConfig({
                    netLoading: false,
                });

                if (code === 200 && data) {
                    const { content, answer } = data;
                    setresult({
                        question: content,
                        answer,
                    });
                } else {
                    // toaster.clear();
                    toaster.push(<Notification type="warning" header={msg} closable />, {
                        placement: 'topEnd',
                    });
                }
                // console.log('成功', res);
            })
            .catch((e) => {
                // console.log('搜题失败', e);
                // toaster.clear();

                setsearchConfig({
                    netLoading: false,
                });

                toaster.push(<Notification type="error" header={e + ''} closable />, {
                    placement: 'topEnd',
                });
            });
    };

    const isShowChatGPTItem = React.useMemo<boolean>(() => {
        if (
            SettingStorage.getEnableChatGPT() &&
            UserStore.me != null &&
            queryChatGPT != null &&
            queryChatGPT !== ""
        ) {
            return true
        }
        return false
    }, [queryChatGPT])

    return (
        <div className="container">
            <AppHead />
            <div className="context">
                <div className="search_box">
                    <InputGroup size="lg">
                        <Input
                            placeholder={'让我看看你遇到什么样的难题了。'}
                            onChange={(value: any) => setkeyword(value)}
                            onKeyUp={(e) => {
                                if (e.key.match('Enter')) {
                                    // 响应回车点击事件，立即搜索
                                    onSearch(keyword);
                                    setqueryChatGPT(keyword);
                                }
                            }}
                        />
                        <InputGroup.Button loading={searchConfig?.netLoading} onClick={() => {
                            onSearch(keyword);
                            setqueryChatGPT(keyword);
                        }}>
                            <Search />
                        </InputGroup.Button>
                    </InputGroup>

                    {result && (
                        <div className="search_result">
                            <div className="item">
                                <h3 className="problem">{result?.question}</h3>
                                <p className="answer">{result?.answer}</p>
                            </div>
                        </div>
                    )}

                    {isShowChatGPTItem && (
                        <ResultChatGPTItem query={queryChatGPT} />
                    )}

                    {/* <div style={{ borderLeft: ".25em solid #94a3b866", maxWidth: 800, margin: "35px 0", paddingLeft: 14 }}>
                        <p style={{ fontWeight: 'bold', flex: 1 }}>长夜将至，我从今开始守望，至死方休。我将不娶妻，不封地，不生子。我将不戴宝冠，不争荣宠。我将尽忠职守，生死于斯。我是黑暗中的利剑，长城上的守卫，抵御寒冷的烈焰，破晓时分的光线，唤醒眠者的号角，守护王国的坚盾。我将生命与荣耀献给守夜人，今夜如此，夜夜皆然。</p>
                        <div style={{ display: 'flex', marginTop: 5 }}>
                            <a>收起</a>
                            <div style={{ flex: 1 }} />
                            <p style={{ textAlign: 'right' }}>- 守夜人</p>
                        </div>
                    </div> */}
                </div>
            </div>
            {/* <div style={{ padding: "14px 38px", display: 'flex' }}>
                <div style={{ flex: 1 }} />
                <div style={{ borderLeft: ".25em solid #94a3b8", paddingLeft: 14 }}>
                    <p style={{ fontWeight: 'bold' }}>What does not kill me makes me stronger.</p>
                    <p style={{ textAlign: 'right' }}>Friedrich Nietzsche</p>
                </div>
            </div> */}
            <AppFooter />
        </div>
    );
}

export default Index;
