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
import { Column, CustomerData, Data } from "../constant/Schemas";
import { getRequest } from "../constant/Api";

const columns: Column[] = [
  {
    id: "customerName",
    label: "Customer Name",
    minWidth: 170,
  },
  { id: "image", label: "Image", minWidth: 50 },
  {
    id: "email",
    label: "Email",
    minWidth: 170,
  },
  {
    id: "phone",
    label: "Phone",
    minWidth: 100,
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
  premium: Boolean
): Data {
  return { customerName, image, email, phone, premium };
}

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: '92vh',
  },
});

export const CustomTable = () => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [customerDetails, setCustomerDetails] = useState<CustomerData[]>();
  const [showAlert, setShowAlert] = useState(false);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getCustomerData = async () => {
    await getRequest().then((res: any) => {
      if (res.status === 200) {
        setCustomerDetails(res?.data);
        setCustomerDetails(
          res?.data.map((item: CustomerData) => {
            return createData(
              item?.firstname + " " + item?.lastname,
              item?.avatarUrl,
              item?.email,
              item?.phone,
              item?.hasPremium
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
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
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
