import * as axios from 'axios';
import { SERVER_URI } from '../utils/constants';

export class UserInteraction {
  public client: axios.AxiosInstance;
  public constructor() {
    this.client = axios.default.create({
      baseURL: SERVER_URI,
      validateStatus: (status: number) => status === 200,
    });
  }
  public login(username: string, password: string): Promise<any> {
    return this.client
      .post(
        'api/users/login',
        { username, password },
        {
          headers: {
            'content-type': 'application/json',
          },
        }
      )
      .then(res => res.data);
  }

  public createUser(
    username: string,
    password: string,
    type: string,
    extraParams: any = {}
  ): Promise<any> {
    return this.client
      .post(
        'api/users',
        { username, password, type },
        {
          headers: {
            'content-type': 'application/json',
          },
          params: extraParams,
        }
      )
      .then(res => res.data);
  }

  public getMyDetails(extraParams: any = {}): Promise<any> {
    return this.client
      .get('/api/users/me', {
        headers: {
          'content-type': 'application/json',
        },
        params: extraParams,
      })
      .then(res => res.data);
  }

  public getUnapprovedTexts(extraParams: any = {}): Promise<any> {
    return this.client
      .get('/api/text/unapproved', {
        headers: {
          'content-type': 'application/json',
        },
        params: extraParams,
      })
      .then(res => res.data);
  }

  public approveText(textID: string, extraParams: any = {}): Promise<any> {
    return this.client
      .put(
        `/api/text/${textID}/approve`,
        {},
        {
          headers: {
            'content-type': 'application/json',
          },
          params: extraParams,
        }
      )
      .then(res => res.data);
  }

  public createText(text: string, extraParams: any = {}): Promise<any> {
    return this.client
      .post(
        `api/text`,
        { text },
        {
          headers: {
            'content-type': 'application/json',
          },
          params: extraParams,
        }
      )
      .then(res => res.data);
  }
}

export default new UserInteraction();
