import * as H from 'history';

export type Location<S = any> = H.Location<S> & {
  query: { [key: string]: any };
};
