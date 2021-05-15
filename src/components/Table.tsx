import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Avatar from "@material-ui/core/Avatar";
import Switch from "@material-ui/core/Switch";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Column, CustomerData, Data } from "../constant/Schemas";
import { getRequest } from "../constant/Api";

const columns: Column[] = [
  {
    id: "customerName",
    label: "Customer Name",
    minWidth: 170,
  },
  { id: "image", label: "Image", minWidth: 170 },
  {
    id: "email",
    label: "Email",
    minWidth: 170,
  },
  {
    id: "phone",
    label: "Phone",
    minWidth: 170,
  },
  {
    id: "premium",
    label: "Premium",
    minWidth: 170,
  },
  {
    id: "bid",
    label: "Max/Min bid",
    minWidth: 170,
  },
];

function createData(
  customerName: string,
  image: string,
  email: string,
  phone: string,
  premium: string,
  bid: number | undefined
): Data {
  return { customerName, image, email, phone, premium, bid };
}

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: "92vh",
  },
});

export const CustomTable = () => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [customerDetails, setCustomerDetails] = useState<CustomerData[]>();
  const [customerData, setCustomerData] = useState<any>();
  const [isDataLoaded, setIsDataLoaded] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [state, setState] = React.useState({
    checkedA: true,
    checkedB: false,
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filterBids = (bids: any, status = 0) => {
    if (bids?.length === 0) {
      return 0;
    }
    const amountArray = bids?.map((item: any) => item?.amount);
    const maxBid = Math.max.apply(Math, amountArray);
    const minBid = Math.min.apply(Math, amountArray);
    if (status) {
      return minBid;
    }
    return maxBid;
  };

  const catchDataChange = (status: number) => {
    setCustomerDetails(
      customerData?.map((item: CustomerData) => {
        return createData(
          item?.firstname + " " + item?.lastname,
          item?.avatarUrl,
          item?.email,
          item?.phone,
          item?.hasPremium ? "True" : "False",
          filterBids(item?.bids, status)
        );
      })
    );
  };

  const getCustomerData = async () => {
    await getRequest().then((res: any) => {
      if (res.status === 200) {
        setIsDataLoaded(false);
        setCustomerData(res?.data);
        setCustomerDetails(
          res?.data?.map((item: CustomerData) => {
            return createData(
              item?.firstname + " " + item?.lastname,
              item?.avatarUrl,
              item?.email,
              item?.phone,
              item?.hasPremium ? "True" : "False",
              filterBids(item?.bids)
            );
          })
        );
      }
      setShowAlert(true);
    });
  };

  useEffect(() => {
    getCustomerData();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.checked });
    if (!event.target.checked) {
      return catchDataChange(0);
    }
    return catchDataChange(1);
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column: any) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                  {column.id === "bid" ? (
                    <Switch
                      checked={state.checkedB}
                      onChange={handleChange}
                      color="primary"
                      name="checkedB"
                      inputProps={{ "aria-label": "primary checkbox" }}
                    />
                  ) : (
                    <></>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {isDataLoaded ? (
            <div style={{ position: "absolute", width: "100%" }}>
              <LinearProgress />
            </div>
          ) : (
            <></>
          )}
          <TableBody>
            {customerDetails
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row: any) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns?.map((column: any) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === "image" ? (
                            <Avatar alt="Remy Sharp" src={value} />
                          ) : column.format && typeof value === "number" ? (
                            column.format(value)
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10]}
        component="div"
        count={customerDetails?.length || 1}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
};
