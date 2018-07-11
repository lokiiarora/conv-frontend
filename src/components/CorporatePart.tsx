import * as React from 'react';
import APIInteraction from '../apiInteractions/all';
import { message, Spin, Divider, Form, Button, Input, Icon, List, Select } from 'antd';

class CorporatePart extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      createUserPayload: {
        password: '',
        type: '',
        username: '',
      },
      loading: true,
      payload: {},
      text: '',
      unapprovedPayload: [],
    };
  }

  public async componentDidMount(): Promise<void> {
    const { token } = this.props;
    try {
      const res = await APIInteraction.getMyDetails({ token });
      const unapproved = await APIInteraction.getUnapprovedTexts({ token });
      console.log(res);
      this.setState((prevState: any, props: any) => {
        const old = Object.assign({}, prevState);
        old.payload = res;
        old.unapprovedPayload = unapproved;
        old.loading = false;
        return Object.assign({}, old);
      });
    } catch (e) {
      console.log(e);
      if (e.response) {
        if (e.response.status === 405) {
          message.info('Session has expired', 3, () => {
            window.localStorage.clear();
            this.props.history.push('/login');
          });
        }
      }
    }
  }

  public render() {
    const { loading, payload, text, createUserPayload } = this.state;
    const { username } = payload;

    if (loading) {
      return (
        <div
          style={{
            background: '#fff',
            display: 'flex',
            flex: '1 1 auto',
            justifyItems: 'center',
            margin: 50,
            padding: 24,
          }}
        >
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              flex: '1 1 auto',
              justifyContent: 'center',
            }}
            className="wrapper-spinner"
          >
            <Spin delay={1} size="large" />
          </div>
        </div>
      );
    }
    return (
      <div
        style={{
          background: '#fff',
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          margin: 50,
          padding: 24,
        }}
      >
        <div className="heading">
          <h2 style={{ textAlign: 'left' }}>
            Welcome <em>{username}</em>
          </h2>

          <Divider />
        </div>
        <div className="text-input">
          <h2 style={{ textAlign: 'left' }}>Enter the quote you want to save</h2>
          <Form layout="inline" onSubmit={e => this.onSubmit(e)}>
            <Form.Item>
              <Input
                value={text}
                name="text"
                onChange={e => this.onChangeText(e)}
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Enter the text you wish to enter?"
              />
            </Form.Item>
            <Form.Item>
              <Button disabled={loading} type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
          <Divider />
        </div>
        <div className="create-user">
          <h2 style={{ textAlign: 'left' }}>Enter the user you want to create?</h2>
          <Form layout="inline" onSubmit={e => this.createUser(e)}>
            <Form.Item>
              <Input
                value={createUserPayload.username}
                name="text"
                required={true}
                onChange={e => this.onChangeCreateUser(e, 'username')}
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Username"
              />
            </Form.Item>
            <Form.Item>
              <Input
                value={createUserPayload.password}
                name="password"
                required={true}
                onChange={e => this.onChangeCreateUser(e, 'password')}
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Select
                onChange={e => this.onChangeSelectType(e as string)}
                defaultActiveFirstOption={true}
                placeholder="Select a type"
              >
                <Select.Option value="corporate">Corporate</Select.Option>
                <Select.Option value="employee">Employee</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button disabled={loading} type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
          <Divider />
        </div>
        <div className="payload-history">
          <h2 style={{ textAlign: 'left' }}>A look at your previous quotes</h2>
          {this.renderLists()}
          <Divider />
        </div>
        <div className="unapproved-payload-history">
          <h2 style={{ textAlign: 'left' }}>A look at employee's pending quote approval</h2>
          {this.renderUnapprovedLists()}
          <Divider />
        </div>
      </div>
    );
  }

  private renderUnapprovedLists(): any {
    const { unapprovedPayload } = this.state;
    return (
      <List
        dataSource={unapprovedPayload}
        bordered={true}
        renderItem={(item: any) => (
          <List.Item
            actions={[
              <Button
                type="primary"
                key={item._id}
                icon="check"
                onClick={() => this.approveListItem(item._id)}
              >
                Approve
              </Button>,
            ]}
          >
            <div>
              {item.payload}
              <br /> <em style={{ color: 'lightblue' }}>Created by: {item.createdBy.username}</em>
            </div>
          </List.Item>
        )}
      />
    );
  }

  private onChangeSelectType(e: string): void {
    this.setState((prevState: any, props: any) => {
      const old = Object.assign({}, prevState);
      old.createUserPayload.type = e;
      return Object.assign({}, old);
    });
  }

  private onChangeCreateUser(e: React.FormEvent<HTMLInputElement>, type: string): void {
    console.log(type);
    const { value } = e.currentTarget;
    this.setState((prevState: any, props: any) => {
      const old = Object.assign({}, prevState);
      old.createUserPayload[type] = value;
      return Object.assign({}, old);
    });
  }

  private async createUser(e: React.FormEvent<HTMLElement>): Promise<void> {
    e.preventDefault();
    const { username, password, type } = this.state.createUserPayload;
    const { token } = this.props;
    try {
      const res = await APIInteraction.createUser(username, password, type, { token });
      this.setState(
        (prevState: any, props: any) => {
          const old = Object.assign({}, prevState);
          old.createUserPayload = {
            password: '',
            type: '',
            username: '',
          };
          return Object.assign({}, old);
        },
        () => {
          message.success(`Successfully created a user with username ${res.username}`);
        }
      );
    } catch (e) {
      console.log(e);
      message.error('Some error has occured');
    }
  }

  private async approveListItem(id: string): Promise<void> {
    const { token } = this.props;
    try {
      await APIInteraction.approveText(id, { token });
      const res = await APIInteraction.getUnapprovedTexts({ token });
      this.setState((prevState: any, props: any) => {
        const old = Object.assign({}, prevState);
        old.unapprovedPayload = res;
        return Object.assign({}, old);
      });
    } catch (e) {
      console.log(e);
      message.error('There was some error');
    }
  }

  private renderLists(): any {
    const { textPayload } = this.state.payload;
    return (
      <List
        dataSource={textPayload}
        bordered={true}
        renderItem={(item: any) => (
          <List.Item>
            <div>
              {item.payload}
              <br />{' '}
              {item.isApproved ? (
                <em style={{ color: 'green' }}>Approved</em>
              ) : (
                <em style={{ color: 'red' }}>Unapproved</em>
              )}
            </div>
          </List.Item>
        )}
      />
    );
  }

  private onChangeText(e: React.FormEvent<HTMLInputElement>): void {
    const { value } = e.currentTarget;
    console.log(value);
    this.setState((prevState: any, props: any) => {
      const old = Object.assign({}, prevState);
      old.text = value;
      return Object.assign({}, old);
    });
  }

  private async onSubmit(e: React.FormEvent<HTMLElement>): Promise<void> {
    e.preventDefault();
    const { token } = this.props;
    try {
      await APIInteraction.createText(this.state.text, { token });
      const res = await APIInteraction.getMyDetails({ token });
      this.setState((prevState: any, props: any) => {
        const old = Object.assign({}, prevState);
        old.text = '';
        old.payload = res;
        return Object.assign({}, old);
      });
    } catch (e) {
      console.log(e);
      message.error('Some error has occured! please try again', 1);
    }
  }
}

export default CorporatePart;
