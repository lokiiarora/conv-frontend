import * as React from 'react';
import { Redirect } from 'react-router-dom';
import { Layout, Form, Icon, Input, Button, message, Divider } from 'antd';
import APIInteraction from '../apiInteractions/all';

export interface ILoginState {
  error: IError;
  loginPayload: ILogin;
  loading?: boolean;
}

export interface ILogin {
  password: string;
  username: string;
}

export interface IError {
  message: string;
  status: boolean;
}

class LoginPage extends React.Component<any, ILoginState> {
  public constructor(props: any) {
    super(props);
    this.state = {
      error: {
        message: '',
        status: false,
      },
      loading: false,
      loginPayload: {
        password: '',
        username: '',
      },
    };
  }

  public async handleSubmit(e: React.FormEvent<any>): Promise<void> {
    e.preventDefault();
    const { loginPayload } = this.state;
    this.setState((prevState: ILoginState, props: any) =>
      Object.assign({}, { loading: true, ...prevState })
    );
    try {
      const { username, password } = loginPayload;
      const res = await APIInteraction.login(username, password);
      console.log(res);
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('token', res.authToken);
      localStorage.setItem('typeOfUser', res.typeOfUser);
      localStorage.setItem('_id', res._id);
      this.props.history.push('/');
    } catch (e) {
      console.log(e);
      if (e.response) {
        let errorPaylod: IError;
        switch (e.response.status as number) {
          case 406:
            errorPaylod = {
              message: "User doesn't exist",
              status: true,
            };
            break;
          case 403:
            errorPaylod = {
              message: 'Wrong password',
              status: true,
            };
            break;
          default:
            errorPaylod = {
              message: 'Some error has occured',
              status: true,
            };
            break;
        }

        this.setState(
          (prevState: ILoginState, props: any) => {
            const old = Object.assign({}, prevState);
            old.error = errorPaylod;
            return Object.assign({}, old);
          },
          () => {
            message.error(this.state.error.message);
          }
        );
      }
    }
  }

  public changeText(e: React.FormEvent<HTMLInputElement>, type: string): void {
    const { value } = e.currentTarget;
    this.setState((prevState: any, props: any) => {
      const old = Object.assign({}, prevState);
      old.loginPayload[type] = value;
      return Object.assign({}, old);
    });
  }

  public render() {
    const { loggedIn } = localStorage;
    if (loggedIn === 'true') {
      return <Redirect to="/" exact={true} />;
    }

    const { loginPayload, error, loading } = this.state;
    const { status } = error;

    return (
      <Layout style={{ height: '100vh' }}>
        <Layout.Content className="login-wrapper">
          <Form onSubmit={e => this.handleSubmit(e)} style={{ padding: '50', width: '200' }}>
            <h2>Login Form</h2>
            <Form.Item>
              <Input
                required={true}
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="username"
                name="username"
                style={{ border: status ? '1px solid red' : 'initial' }}
                value={loginPayload.username}
                onChange={e => this.changeText(e, 'username')}
              />
            </Form.Item>
            <Form.Item>
              <Input
                required={true}
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="password"
                type="password"
                style={{ border: status ? '1px solid red' : 'initial' }}
                onChange={e => this.changeText(e, 'password')}
                name="password"
                value={loginPayload.password}
              />
            </Form.Item>
            <Button
              loading={loading}
              type="primary"
              htmlType="submit"
              className="login-form-button"
              style={{ margin: '20' }}
            >
              Log in
            </Button>
            <Divider>Or</Divider>
            <Button
              style={{ margin: '20' }}
              loading={loading}
              type="default"
              className="login-form-button"
              onClick={() => this.guestLogin()}
            >
              Log in as a guest
            </Button>
          </Form>
        </Layout.Content>
      </Layout>
    );
  }

  private guestLogin(): void {
    window.localStorage.setItem('loggedIn', 'true');
    window.localStorage.setItem('typeOfUser', 'guest');
    this.props.history.push('/');
  }
}

export default LoginPage;
