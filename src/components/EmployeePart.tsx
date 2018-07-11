import * as React from 'react';
import APIInteraction from '../apiInteractions/all';
import { Spin, Divider, Form, Icon, Input, Button, message, List } from 'antd';

class EmployeePart extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      loading: true,
      payload: {},
      text: '',
    };
  }

  public async componentDidMount(): Promise<void> {
    const { token } = this.props;
    try {
      const res = await APIInteraction.getMyDetails({ token });
      console.log(res);
      this.setState((prevState: any, props: any) => {
        const old = Object.assign({}, prevState);
        old.payload = res;
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
    const { loading, payload, text } = this.state;
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
        <div className="payload-history">
          <h2 style={{ textAlign: 'left' }}>A look at your previous quotes</h2>
          {this.renderLists()}
        </div>
      </div>
    );
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

export default EmployeePart;
