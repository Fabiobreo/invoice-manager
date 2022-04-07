import Card from "../../UI/Card";
import ClientsTable from "./ClientsTable";

import classes from "./Clients.module.css";
import useRouter from "../../../hooks/useRuoter";
import { useCallback } from "react";

const Clients = () => {
  const router = useRouter();
  const { pathname, history } = router;

  const currentPage = router.query.page ? +router.query.page : 1;
  const sort = router.query.sort ? router.query.sort : "";
  const sortBy = router.query.sortBy ? router.query.sortBy : "";

  const linkHandler = useCallback(
    (page: number, sortBy: string, sort: string) => {
      let searchString = "";
      if (page > 1) {
        searchString = `page=${page}`;
      }
      if (sort !== "" && sortBy !== "") {
        if (searchString.length > 0) searchString += "&";
        searchString += `sortBy=${sortBy}&sort=${sort}`;
      }

      if (searchString.length > 0) {
        searchString = "?" + searchString;
        history.replace({
          pathname: pathname,
          search: searchString,
        });
      } else {
        history.push({
          pathname: pathname,
        });
      }
    },
    []
  );

  return (
    <Card className={classes.clients}>
      <ClientsTable
        title={"Clients"}
        disableSortBy={false}
        showPagination={true}
        isShowAllVisible={false}
        isAddNewVisible={true}
        currentPage={currentPage}
        sort={sort}
        sortBy={sortBy}
        linkHandler={linkHandler}
      />
    </Card>
  );
};

export default Clients;
