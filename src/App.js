import { useState } from 'react';
import { Button, InputGroup, Input } from 'rsuite';
import { Search } from '@rsuite/icons';
import './App.scss';

function App() {
	const [keyword, setkeyword] = useState('');

	return (
		<div className="container">
			<header className="header">
				<h1 className="logo">全能搜题</h1>
			</header>
			<div className="context">
				<div className="search_box">
					<InputGroup size="lg">
						<Input placeholder={'让我看看你遇到什么样的难题了。'} onChange={(value) => setkeyword(value)} />
						<InputGroup.Button
							onClick={() => {
								console.log('点击了');
							}}
						>
							<Search />
						</InputGroup.Button>
					</InputGroup>
				</div>
			</div>
			<div className="footer">
				<p>@逐梦工作室 提供技术支持</p>
			</div>
		</div>
	);
}

export default App;
