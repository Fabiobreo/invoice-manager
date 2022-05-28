import { useReducer, useCallback, useContext } from "react";
import { AuthContext } from "../store/auth-context";

type Action = {
  type: string;
  responseData?: any;
  errorMessage?: string;
};

type State = {
  data: any;
  error: string | null;
  status: string | null;
};

const httpReducer = (state: State, action: Action): State => {
  if (action.type === "SEND") {
    return {
      data: null,
      error: null,
      status: "pending",
    };
  }

  if (action.type === "SUCCESS") {
    return {
      data: action.responseData,
      error: null,
      status: "completed",
    };
  }

  if (action.type === "ERROR") {
    return {
      data: null,
      error: action.errorMessage ? action.errorMessage : "Error",
      status: "completed",
    };
  }

  return state;
};

const useHttp = (
  requestFunction: (parameter: any) => Promise<any>,
  startWithPending = false
) => {
  const authCtx = useContext(AuthContext);
  const {token} = authCtx;

  const [httpState, dispatch] = useReducer(httpReducer, {
    status: startWithPending ? "pending" : null,
    data: null,
    error: null,
  });

  const sendRequest = useCallback(
    async function (requestData) {
      dispatch({ type: "SEND" });
      try {
        const responseData = await requestFunction({...requestData, token});

        dispatch({ type: "SUCCESS", responseData });
      } catch (error) {
        let message;
        if (error instanceof Error) {
          message = error.message;
        } else {
          message = String(error);
        }
        dispatch({
          type: "ERROR",
          errorMessage: message || "Something went wrong!",
        });
      }
    },
    [requestFunction]
  );

  return {
    sendRequest,
    ...httpState,
  };
};

export default useHttp;
