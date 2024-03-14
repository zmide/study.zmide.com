/*
 * @Author: Bin
 * @Date: 2024-03-13
 * @FilePath: /so.jszkk.com/src/views/question/analyzes/Steps02.tsx
 */
import React from 'react'
import { Row, Table, SelectPicker, Button } from 'rsuite';


const { Column, HeaderCell, Cell } = Table;

const CompactCell = (props: any) => <Cell {...props} style={{ padding: 4 }} />;
const CompactHeaderCell = (props: any) => <HeaderCell {...props} style={{ padding: 4 }} />;


export default function Steps02() {

    const defaultColumns = [
        {
            key: 'id',
            label: '#',
            fixed: true,
            width: 70
        },
        {
            key: 'a',
            label: '列 A',
            fixed: true,
            width: 130
        },
        {
            key: 'b',
            label: '列 B',
            width: 123
        },

        {
            key: 'c',
            label: '列 C',
            width: 200
        },
        {
            key: 'd',
            label: '列 D',
            flexGrow: 1
        },
        {
            key: 'ctl',
            label: '# 操作',
            flexGrow: 1
        }
    ];

    const columns = defaultColumns;


    const rowKeys = [
        {
            label: 'A',
            value: 0,
        },
        {
            label: 'B',
            value: 1,
        },
        {
            label: 'C',
            value: 2,
        },
    ]

    return (
        <div>
            <Table
                height={300}
                fillHeight={false}
                showHeader={true}
                autoHeight={false}
                data={[]}
                bordered={true}
                cellBordered={true}
                headerHeight={30}
                rowHeight={30}
            >
                {columns.map(column => {
                    const { key, label, ...rest } = column;
                    return (
                        <Column {...rest} key={key}>
                            <CompactHeaderCell>{label}</CompactHeaderCell>
                            <CompactCell dataKey={key} />
                        </Column>
                    );
                })}
            </Table>

            <Row style={{ padding: '20px 5px', paddingBottom: 0 }}>
                <SelectPicker label="题目内容" data={rowKeys} searchable={false} style={{ width: 124, marginRight: 10 }} defaultValue={0} />
                <SelectPicker label="正确答案" data={rowKeys} searchable={false} style={{ width: 124, marginRight: 10 }} defaultValue={0} />

            </Row>
            <Row style={{ padding: '10px 5px' }}>
                <SelectPicker label="A 选项" data={rowKeys} searchable={false} style={{ width: 124, marginRight: 10 }} defaultValue={0} />
                <SelectPicker label="B 选项" data={rowKeys} searchable={false} style={{ width: 124, marginRight: 10 }} defaultValue={0} />
                <SelectPicker label="C 选项" data={rowKeys} searchable={false} style={{ width: 124, marginRight: 10 }} defaultValue={0} />
                <SelectPicker label="D 选项" data={rowKeys} searchable={false} style={{ width: 124, marginRight: 10 }} defaultValue={0} />
                <Button>增加选项</Button>
            </Row>
            <Row>
                <div style={{ flex: 1 }}></div>
                <Button appearance='link'>高级配置</Button>
            </Row>

        </div>
    )
}
