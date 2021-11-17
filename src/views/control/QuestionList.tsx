/*
 * @Author: Bin
 * @Date: 2021-11-17
 * @FilePath: /so.jszkk.com/src/views/control/QuestionList.tsx
 */
import useAxios from 'axios-hooks';
import React, { useEffect, useState } from 'react';
import { Row, Button, Divider, List, Pagination, Loader } from 'rsuite';

export default function QuestionList() {
	const [{ data: questionData, loading: questionLoading, error: questionError }, questionRefetch] =
		useAxios('/api/question/list');

	const [questionList, setquestionList] = useState<any>();

	useEffect(() => {
		if (questionData?.data) {
			// 数据加载成功
			setquestionList({
				...questionData?.data,
			});
			console.log(questionData?.data);
		}
	}, [questionData]);

	return (
		<div>
			<div>
				<div>
					<Row style={{ display: 'flex', padding: 10 }}>
						<h4 style={{ fontWeight: 300 }}>题目列表</h4>
						<div style={{ flex: 1 }} />
						<Button appearance="primary" onClick={() => {}}>
							提交题目
						</Button>
					</Row>
					<Divider style={{ margin: 0 }} />
				</div>
				<p style={{ padding: '10px 0' }}>目前暂时只能查看最近上传的 100 道题目。</p>
				<div style={{ margin: '20px 0' }}>
					{questionLoading ? (
						<div>
							<Loader center content="loading..." vertical />
						</div>
					) : (
						<>
							<List bordered>
								{questionList?.data?.map((item: any, index: number) => (
									<List.Item key={index} index={index} style={{ padding: 25 }}>
										<b>{item?.content}</b>
										<p style={{ marginTop: 10, color: '#0006' }}>{item?.answer}</p>
									</List.Item>
								))}
							</List>

							<div style={{ padding: 20 }}>
								<Pagination
									prev
									next
									first
									last
									ellipsis
									boundaryLinks
									maxButtons={3}
									size="xs"
									layout={['total', '-', 'pager']}
									locale={{
										total: '共有 {0} 道题',
									}}
									total={questionList?.total}
									limit={questionList?.perPage}
									activePage={questionList?.currentPage}
									onChangePage={(index: number) => {
										questionRefetch({
											params: {
												page: index,
												size: questionList?.perPage,
											},
										});
									}}
								/>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
