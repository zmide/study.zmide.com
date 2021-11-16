/*
 * @Author: Bin
 * @Date: 2021-11-15
 * @FilePath: /so.jszkk.com/src/routers/routes.ts
 */
import React from 'react';

import { HomeScreen, ControlScreen, NotFoundScreen } from 'views'


const routes = [
    {
        path: "/",
        component: HomeScreen,
    },
    {
        path: "/control",
        component: ControlScreen,
    },
    {
        path: "*",
        component: NotFoundScreen,
    },
];

export default routes;