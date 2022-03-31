import Card from "../../ui/Card";
import ClientsTable from "./ClientsTable";

import classes from "./Clients.module.css";

const Clients = () => {
  return (
    <Card className={classes.clients}>
      <ClientsTable
        title={"Clients"}
        disableSortBy={false}
        showPagination={true}
        isShowAllVisible={false}
        isAddNewVisible={true}
      />
    </Card>
  );
};

export default Clients;
