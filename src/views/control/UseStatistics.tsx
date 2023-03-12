/*
 * @Author: Bin
 * @Date: 2021-11-16
 * @FilePath: /so.jszkk.com/src/views/control/UseStatistics.tsx
 */
import React, { useEffect } from 'react';

import useAxios from 'axios-hooks';
import { Panel, FlexboxGrid, Col, Loader, Toggle, Divider, Stack } from 'rsuite';
import { observer } from 'mobx-react';
import { UserStore } from 'stores';
import SettingStorage from 'stores/SettingStorage';

function UseStatistics() {
    const [{ data, loading }, refetch] = useAxios({
        method: 'GET',
        url: '/api/panel/stats',
    });

    useEffect(() => {
        refetch();
        UserStore.updateInfo();
    }, [refetch]);

    if (loading) {
        return (
            <div>
                <Loader center content="loading..." vertical />
            </div>
        );
    }

    return (
        <div>
            <FlexboxGrid>
                <FlexboxGrid.Item as={Col} colspan={24} md={6}>
                    <Panel header="上传题目数" bordered>
                        <p>{data?.data?.count_questions}</p>
                    </Panel>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item as={Col} colspan={24} md={6}>
                    <Panel header="应用密钥数" bordered>
                        <p>{data?.data?.count_appsecrets}</p>
                    </Panel>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item as={Col} colspan={24} md={6}>
                    <Panel header="ChatGPT 权限" bordered>
                        <p>{UserStore.me?.is_vip ? "内测用户" : "非内测用户"}</p>
                    </Panel>
                </FlexboxGrid.Item>
            </FlexboxGrid>

            <Panel style={{ margin: 5 }} header="应用配置">
                <Stack direction="column" spacing={20} alignItems="flex-start">
                    <Stack spacing={12}>
                        <label>启用 ChatGPT 搜索:</label>
                        <Toggle checked={SettingStorage.getEnableChatGPT()} onChange={(value) => {
                            SettingStorage.setEnableChatGPT(value);
                        }} />
                    </Stack>
                    {/* <Stack spacing={12}>
                        <label>显示开发者 slogan:</label>
                        <Toggle />
                    </Stack> */}
                </Stack>
            </Panel>

        </div>
    );
}

export default observer(UseStatistics)