import React, { createContext, useEffect, useState } from "react";
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
import Checkbox from "@material-ui/core/Checkbox";
import Alert from "@material-ui/lab/Alert";
import {useHistory} from 'react-router-dom';
import {
  Column,
  CustomerData,
  SimplifiedData,
  Data,
} from "../constant/Schemas";
import { getRequest } from "../constant/Api";
import { createData, createDataOfMinMaxBid, filterBids, sortByProperty } from "../constant/functions";


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
    minWidth: 100,
  },
  {
    id: "sort",
    label: "Sort By Bid",
    minWidth: 10,
  },
];

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: "92vh",
  },
});


export const CustomTable: React.FC = () => {
  const history = useHistory();
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [customerDetailsWithMinMaxBid, setcustomerDetailsWithMinMaxBid] =
    useState<SimplifiedData[]>();
  const [customerDetails, setCustomerDetails] = useState<Data[]>();
  const [isDataLoaded, setIsDataLoaded] = useState(true);
  const [bidArray, setBidArray] = useState<any>();
  const [toggle, setToggle] = useState(false);
  const [checked, setChecked] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    getServerData();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToggle(event.target.checked);
    setChecked(false);
      setCustomerDetails(
        customerDetailsWithMinMaxBid?.map((item: any) => {
          return createData(
            item?.customerName,
            item?.image,
            item?.email,
            item?.phone,
            item?.premium,
            event.target.checked ? item?.bid?.minBid : item?.bid?.maxBid
          );
        })
      );

  };

  const getServerData = async () => {
    await getRequest().then((res: any) => {
      if (res.status === 200) {
        setBidArray(res?.data?.map((data: CustomerData) => data.bids))
        setIsDataLoaded(false);
        setcustomerDetailsWithMinMaxBid(
          res?.data?.map((item: CustomerData) => {
            return createDataOfMinMaxBid(
              item?.firstname + " " + item?.lastname,
              item?.avatarUrl,
              item?.email,
              item?.phone,
              item?.hasPremium ? "True" : "False",
              {
                minBid: filterBids(item?.bids, 1),
                maxBid: filterBids(item?.bids),
              }
            );
          })
        );
        setCustomerDetails(
          res?.data?.map((item: CustomerData) => {
            return createData(
              item?.firstname + " " + item?.lastname,
              item?.avatarUrl,
              item?.email,
              item?.phone,
              item?.hasPremium ? "Yes" : "No",
              filterBids(item?.bids)
            );
          })
        );
      } else {
        setShowAlert(true);
      }
    }).catch(() => setShowAlert(true))
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
      if(event.target.checked){
        setCustomerDetails(
          customerDetailsWithMinMaxBid
            ?.map((item: any) => {
              return createData(
                item?.customerName,
                item?.image,
                item?.email,
                item?.phone,
                item?.premium,
                toggle ? item?.bid?.minBid : item?.bid?.maxBid
              );
            })
            .sort(sortByProperty("bid"))
        );
      }
      else{
        setCustomerDetails(
          customerDetailsWithMinMaxBid
            ?.map((item: any) => {
              return createData(
                item?.customerName,
                item?.image,
                item?.email,
                item?.phone,
                item?.premium,
                toggle ? item?.bid?.minBid : item?.bid?.maxBid
              );
            })
        )
      }
  };

  const routeToDashboard = (row: any, bidArray: any) => {
    history.push("/dashboard",{row, bidArray})
  }

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
                      <>
                        <Switch
                          checked={toggle}
                          onChange={handleToggleChange}
                          color="primary"
                          name="checkedB"
                          inputProps={{ "aria-label": "primary checkbox" }}
                        />
                      </>
                    ) : column.id === "sort" ? (
                      <Checkbox
                        color="primary"
                        checked={checked}
                        onChange={handleCheckboxChange}
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
            ) : null}
            {showAlert ? (
              <div style={{ position: "absolute", width: "100%" }}>
                <Alert severity="error">This is an error!</Alert>
              </div>
            ) : null}
            <TableBody>
              {customerDetails
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row: any, key: any) => {
                  return (
                    <TableRow
                      onClick={() => routeToDashboard(row, bidArray[key])}
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
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
          rowsPerPageOptions={[8]}
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
