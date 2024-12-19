import React, { useState } from 'react';
import { Layout, Menu, Select, Input, Button, notification, Spin } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    SendOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { getWalletAddress, tokenTransfer } from '../utils/interact';

const { Header, Sider, Content } = Layout;
const { Option } = Select;

const Container = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [senderIndex, setSenderIndex] = useState();
    const [receiver, setReceiver] = useState();
    const [amount, setAmouont] = useState();
    const [token, setToken] = useState("ETH");

    const addresses = getWalletAddress();

    const toggleCollpase = () => {
        setCollapsed(!collapsed);
    }

    const changeSender = (index) => {
        setSenderIndex(index);
    }

    const changeReceiver = (e) => {
        setReceiver(e.target.value);
    }

    const changeAmount = (e) => {
        setAmouont(e.target.value);
    }

    const changeToken = (value) => {
        setToken(value);
    }

    const handleSend = async () => {
        if (!senderIndex || !receiver || !amount) {
            notification.error({message: 'Error', description: 'Please input all field'});
            return ;
        }
        setIsLoading(true);
        const result = await tokenTransfer(senderIndex, receiver, amount, token);
        setIsLoading(false);
        if (result) {
            notification.success({message: 'Success', description: 'Transaction successed'});
        } else {
            notification.error({message: 'Error', description: 'Transaction failed'});
        }
    }
    
    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo" />
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1" icon={<SendOutlined />}>
                        Send
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: 0 }}>
                    <div className='collapse-btn' onClick={toggleCollpase}>
                        {
                            collapsed 
                                ? <MenuUnfoldOutlined />
                                : <MenuFoldOutlined />
                        }
                    </div>
                </Header>
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                    }}
                >
                    <Spin spinning={isLoading} >
                        <Select style={{width: '100%', margin: '8px'}} onChange={changeSender}>
                            {
                                addresses.map((addr, index) => 
                                    <Option key={index} value={index} >{addr}</Option>
                                )
                            }
                        </Select>
                        <Input 
                            style={{width: '100%', margin: '8px'}}
                            value={receiver} 
                            onChange={changeReceiver} />
                        <Input
                            style={{width: '100%', margin: '8px'}}
                            value={amount}
                            onChange={changeAmount} />
                        <Select value={token} style={{width: '100%', margin: '8px'}} onChange={changeToken}>
                            <Option value="ETH" >ETH</Option>
                            <Option value="BUSD" >BUSD</Option>
                        </Select>
                        <Button 
                            style={{width: '100%', margin: '8px'}} 
                            type={'primary'}
                            shape="round" 
                            icon={<LogoutOutlined />} 
                            onClick={handleSend} >Send</Button>
                    </Spin>
                </Content>
            </Layout>
        </Layout>
    );
}

export default Container;