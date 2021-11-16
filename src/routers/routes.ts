/*
 * @Author: Bin
 * @Date: 2021-11-15
 * @FilePath: /so.jszkk.com/src/routers/routes.ts
 */
import React from 'react';

import { HomeScreen, ControlScreen, NotFoundScreen, ControlUseStatistics, ApplicationKey } from 'views'

const routes = [
    {
        path: "/",
        component: HomeScreen,
    },
    {
        path: "/control",
        component: ControlScreen,
        childs: [
            {
                path: "statistics",
                index: false,
                component: ControlUseStatistics,
            },
            {
                path: "appkeys",
                component: ApplicationKey,
            }
        ]
    },
    {
        path: "*",
        component: NotFoundScreen,
    },
];

export default routes;