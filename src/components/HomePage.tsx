import * as React from 'react';
import { Redirect } from 'react-router-dom';
import { Layout, Menu, Button, message } from 'antd';
import GuestPart from './GuestPart';
import EmployeePart from './EmployeePart';
import CorporatePart from './CorporatePart';

const { Header, Content } = Layout;

class HomePage extends React.Component<any, any> {
  public componentDidMount(): void {
    message.success(
      `Welcome to the Homepage! You are logged in as ${window.localStorage.getItem('typeOfUser')}`,
      1
    );
  }

  public render() {
    const { loggedIn } = localStorage;
    console.log(localStorage);
    if (loggedIn === 'true') {
      return (
        <Layout className="layout">
          <Header>
            <Menu
              theme="dark"
              mode="horizontal"
              style={{ lineHeight: '64px', display: 'flex', justifyContent: 'flex-end' }}
            >
              <Menu.Item>
                <Button onClick={() => this.logout()}>Logout</Button>
              </Menu.Item>
            </Menu>
          </Header>
          <Content style={{ padding: '50', minHeight: '100vh', display: 'flex' }}>
            {this.payloadRenderer()}
          </Content>
        </Layout>
      );
    }
    return <Redirect to="/login" exact={true} />;
  }

  private payloadRenderer(): any {
    const { typeOfUser, token } = localStorage;
    switch (typeOfUser as string) {
      case 'guest':
        return <GuestPart />;
      case 'employee':
        return <EmployeePart history={this.props.history} token={token} />;
      case 'corporate':
        return <CorporatePart history={this.props.history} token={token} />;
      default:
        return <p>Random stuff</p>;
    }
  }

  private logout(): void {
    localStorage.clear();
    this.props.history.push('/login');
  }
}

export default HomePage;
