/*
 * @Author: Bin
 * @Date: 2021-11-16
 * @FilePath: /so.jszkk.com/src/views/control/UseStatistics.tsx
 */
import React from 'react';

import useAxios from 'axios-hooks';
import { Panel, FlexboxGrid, Col, Loader } from 'rsuite';

export default function UseStatistics() {
	const [{ data, loading, error }, refetch] = useAxios({
		method: 'GET',
		url: '/api/panel/stats',
	});

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
			</FlexboxGrid>
		</div>
	);
}
