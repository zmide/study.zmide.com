/*
 * @Author: Bin
 * @Date: 2023-12-05
 * @FilePath: /so.jszkk.com/src/views/question/analyzes/Steps00.tsx
 */
import React from 'react'

import './AnalyzesSteps.scss';

interface Steps00Props {
    onSelected: (index: number) => void
}

export default function Steps00(props: Steps00Props) {


    const list = [{
        title: 'XLSX 文件上传',
        subtitle: '通过表格文件批量上传题库',
        onClick: () => { }
    }]

    return (
        <div className='analyzes_list' style={{}}>
            {list.map((item, index) => (
                <div key={`analyzes_steps00_item_${index}`}
                    className={`analyzes_item`}
                    onClick={() => props.onSelected(index)}>
                    <p className='title'>{item.title}</p>
                    <p className='subtitle'>{item.subtitle}</p>
                </div>
            ))}

        </div>
    )
}
