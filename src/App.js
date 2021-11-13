import { useState, useEffect } from 'react';
import { InputGroup, Input, Notification, toaster } from 'rsuite';
import { Search } from '@rsuite/icons';
import './App.scss';
import axios from 'axios';
import useAckee from 'use-ackee';

function App() {
	const [keyword, setkeyword] = useState('');
	const [result, setresult] = useState();

	useAckee(
		'/',
		{
			server: 'http://tongji.zmide.com',
			domainId: 'ae768a4b-3b79-4bc9-b2d8-b14b6c4e20ee',
		},
		{
			detailed: false,
			ignoreLocalhost: true,
			ignoreOwnVisits: true,
		}
	);

	const onSearch = (key) => {
		setresult(undefined);

		if (!key) {
			return;
		}

		axios
			.get('//tool.chaoxing.zmorg.cn/api/search.php?q=' + key)
			.then((res) => {
				const { msg } = res?.data;
				if (msg?.answer && msg?.question) {
					setresult(msg);
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
				toaster.push(<Notification type="error" header={e + ''} closable />, {
					placement: 'topEnd',
				});
			});
	};

	return (
		<div className="container">
			<header className="header">
				<h1 className="logo">全能搜题</h1>
			</header>
			<div className="context">
				<div className="search_box">
					<InputGroup size="lg">
						<Input
							placeholder={'让我看看你遇到什么样的难题了。'}
							onChange={(value) => setkeyword(value)}
							onKeyUp={(e) => {
								if (e.keyCode === 13) {
									// 响应回车点击事件，立即搜索
									onSearch(keyword);
								}
							}}
						/>
						<InputGroup.Button onClick={() => onSearch(keyword)}>
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
			<div className="footer">
				<p>@逐梦工作室 提供技术支持</p>
			</div>
		</div>
	);
}

export default App;
