import { useHistory, useLocation, useParams } from "react-router-dom";
import { LocationDescriptor, History } from "history";
import { useMemo } from "react";
import queryString from "query-string";

export type RuoterQuery = {
  page?: number;
  sort?: string;
  sortBy?: string;
  clientId?: string;
};

const useRouter = (): {
  push: (location: LocationDescriptor<unknown>, state?: unknown) => void;
  replace: (location: LocationDescriptor<unknown>, state?: unknown) => void;
  pathname: string;
  history: History<unknown>;
  query: RuoterQuery;
} => {
  const params = useParams();
  const location = useLocation();
  const history = useHistory();

  return useMemo(() => {
    return {
      push: history.push,
      replace: history.replace,
      pathname: location.pathname,
      history: history,
      query: {
        ...queryString.parse(location.search),
        ...params,
      },
    };
  }, [params, location, history]);
};

export default useRouter;
