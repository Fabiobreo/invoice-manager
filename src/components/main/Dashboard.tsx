import { Fragment } from "react";
import Card from "../ui/Card";
import ClientsTable from "./clients/ClientsTable";

import classes from "./Dashboard.module.css";

const Dashboard = () => {
  return (
    <Fragment>
      <Card className={classes.dashboard}>
        <ClientsTable />
      </Card>
      <Card className={classes.dashboard}>
        <ClientsTable />
      </Card>
    </Fragment>
  );
};

export default Dashboard;
