import * as React from 'react';

class GuestPart extends React.Component<any, any> {
  public render() {
    return (
      <div
        style={{
          background: '#fff',
          display: 'flex',
          flex: '1 1 auto',
          margin: 50,
          padding: 24,
        }}
      >
        I'm a guest and I have no rights!
      </div>
    );
  }
}

export default GuestPart;
