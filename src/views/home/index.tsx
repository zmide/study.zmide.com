/*
 * @Author: Bin
 * @Date: 2021-11-15
 * @FilePath: /so.jszkk.com/src/views/home/index.tsx
 */

import { useState } from 'react';
import { InputGroup, Input, Notification, toaster } from 'rsuite';
import { Search } from '@rsuite/icons';
import axios from 'axios';
import useAckee from 'use-ackee';

import { AppHead, AppFooter } from 'components';
import config from 'config';

function Index() {
	const [keyword, setkeyword] = useState('');
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
								}
							}}
						/>
						<InputGroup.Button loading={searchConfig?.netLoading} onClick={() => onSearch(keyword)}>
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
				</div>
			</div>
			<AppFooter />
		</div>
	);
}

export default Index;
