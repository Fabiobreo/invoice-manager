import { Fragment } from "react";
import Card from "../ui/Card";
import ClientsTable from "./clients/ClientsTable";

import classes from "./Dashboard.module.css";
import InvoicesTable from "./invoices/InvoicesTable";

const Dashboard = () => {
  return (
    <Fragment>
      <Card className={classes.clientDashboard}>
        <ClientsTable
          title={"Last clients"}
          disableSortBy={true}
          showPagination={false}
          isShowAllVisible={true}
          isAddNewVisible={true}
        />
      </Card>
      <Card className={classes.invoicesDashboard}>
        <InvoicesTable
          title={"Last invoices"}
          disableSortBy={true}
          showPagination={false}
          isShowAllVisible={true}
          isAddNewVisible={true}/>
      </Card>
    </Fragment>
  );
};

export default Dashboard;
