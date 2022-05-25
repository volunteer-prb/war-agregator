import axios from 'axios';
import { useQuery } from 'react-query';
import * as api from './open-api';

type GetOrProp<T, P extends string> = T extends { [key in P]: infer R }
  ? R
  : never;
type NoNever<T> = { [P in keyof T as T[P] extends never ? never : P]: T[P] };

type Paths = keyof api.paths;
type Methods<PATH extends Paths> = keyof api.paths[PATH];
type Params<PATH extends Paths, METHOD extends Methods<PATH>> = GetOrProp<
  api.paths[PATH][METHOD],
  'parameters'
>;
export type Response<
  PATH extends Paths,
  METHOD extends Methods<PATH>,
> = GetOrProp<api.paths[PATH][METHOD], 'responses'>;

type Payload<PATH extends Paths, METHOD extends Methods<PATH>> = {
  query: GetOrProp<Params<PATH, METHOD>, 'query'>;
  body: GetOrProp<Params<PATH, METHOD>, 'body'>;
};

type Content<T> = GetOrProp<GetOrProp<T, 'content'>, 'application/json'>;

export type Result<
  PATH extends Paths,
  METHOD extends Methods<PATH>,
  STATUS extends 'success' | 'old',
> = {
  [P in keyof Response<PATH, METHOD>]: {
    statusCode: P;
    status: STATUS;
    value: Content<Response<PATH, METHOD>[P]>;
  };
}[keyof Response<PATH, METHOD>];

type Return<PATH extends Paths, METHOD extends Methods<PATH>> =
  | {
      status: 'loading';
    }
  | {
      status: 'error';
    }
  | Result<PATH, METHOD, 'old' | 'success'>;

function formatQuery<PATH extends Paths, METHOD extends Methods<PATH>>(
  payload: Payload<PATH, METHOD>,
) {
  if ('query' in payload) {
    const query = payload.query as object;
    const keyValues = Object.entries(query);
    if (keyValues.length === 0) {
      return undefined;
    } else {
      return Object.entries(query)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
    }
  } else {
    return undefined;
  }
}

export function useApi<
  PATH extends Paths,
  METHOD extends Methods<PATH> & string,
>(
  path: PATH,
  method: METHOD,
  params: NoNever<Payload<PATH, METHOD>>,
): Return<PATH, METHOD> {
  const payload = params as Payload<PATH, METHOD>;
  const queryStr = formatQuery(payload);
  const { data, status, isPreviousData } = useQuery(
    [path, queryStr, payload.body],
    async () => {
      const value = await axios({
        url: queryStr ? `${path}?${queryStr}` : path,
        method,
        data: payload.body,
      });
      return {
        value: value.data,
        status: value.status,
      };
    },
  );

  switch (status) {
    case 'error':
      return {
        status: 'error',
      };
    case 'loading':
      return {
        status: 'loading',
      };
    case 'idle':
      return {
        status: 'loading',
      };
    case 'success':
      if (isPreviousData) {
        return {
          statusCode: data.status,
          status: 'old',
          value: data.value,
        } as Return<PATH, METHOD>;
      } else {
        return {
          statusCode: data.status,
          status: 'success',
          value: data.value,
        } as Return<PATH, METHOD>;
      }
  }
}
