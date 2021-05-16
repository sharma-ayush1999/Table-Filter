import React, { useState, useEffect } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 345,
      position: "absolute",
      left: "38%",
    },
    media: {
      height: 0,
      paddingTop: "56.25%", // 16:9
    },
    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: "rotate(180deg)",
    },
    avatar: {
      backgroundColor: red[500],
    },
  })
);

export const Dashboard = () => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [individualData, setIndividualData] = useState<any>();
  const history = useHistory();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    console.log(history.location.state);
    setIndividualData(history.location.state);
  }, []);

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar
            // src={individualData?.row?.image}
            aria-label="recipe"
            className={classes.avatar}
          >
            {individualData?.row?.customerName.slice(0, 1)}
          </Avatar>
        }
        title={individualData?.row?.customerName}
        subheader={`Premium: ${individualData?.row?.premium}`}
      />
      <CardMedia className={classes.media} image={individualData?.row?.image} />
      <CardContent>
        <p>
          <span style={{ fontWeight: 500 }}>Email:</span>{" "}
          {individualData?.row?.email}
        </p>
        <p>
          <span style={{ fontWeight: 500 }}>Phone:</span>{" "}
          {individualData?.row?.phone}
        </p>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
        Show All Bids
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent style={{ display: "flex", flexWrap: "wrap" }}>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Car Title</TableCell>
                  <TableCell>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {individualData?.bidArray?.map((item: any) => {
                  return (
                    <TableRow key={item.id}>
                      <TableCell>{item.carTitle}</TableCell>
                      <TableCell>{item.amount}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Collapse>
    </Card>
  );
};
