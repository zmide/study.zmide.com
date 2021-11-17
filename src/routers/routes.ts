/*
 * @Author: Bin
 * @Date: 2021-11-15
 * @FilePath: /so.jszkk.com/src/routers/routes.ts
 */
import { HomeScreen, ControlScreen, NotFoundScreen, ControlUseStatistics, ApplicationKey } from 'views'

const routes = [
    {
        path: "/",
        component: HomeScreen,
    },
    {
        path: "/control",
        component: ControlScreen,
        login: true, // 通过此参数控制页面是否需要登陆
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