/*
 * @Author: Bin
 * @Date: 2023-03-12
 * @FilePath: /so.jszkk.com/src/components/ResultChatGPTItem.tsx
 */
import useAxios from 'axios-hooks';
import React from 'react'
import { Tag } from 'rsuite';
import Skeleton from './skeleton';

export interface ResultChatGPTItemProps {
    query: string
}

export default function ResultChatGPTItem(props: ResultChatGPTItemProps) {
    const { query } = props;

    const [{ data, loading, error }] = useAxios({
        method: 'GET',
        url: '/api/gpt',
        params: {
            q: query
        }
    });

    const resultContent = React.useMemo(() => {
        if (error || !data) {
            return error?.message || '网络异常'
        }

        const { code, msg } = data;
        if (code !== 200) {
            return msg
        }
        if (data.data.content) {
            return data.data.content
        }
        return "ChatGPT 服务异常。"
    }, [data, error])

    return !query ? null : (
        <div className="search_result">
            <div className="item">
                <h3 className="problem">{query || '咦，还没想好要问啥吗？试试问它: 人生的意义是不是去码头整点薯条？'}</h3>
                <Skeleton loading={loading} theme="paragraph" delay={1500} animation="flashed">
                    <p className="answer">{resultContent}</p>
                </Skeleton>
                <div className='result_container'>
                    <div className='operates'></div>
                    <Tag color="cyan">ChatGPT</Tag>
                </div>
            </div>
        </div>
    )
}
