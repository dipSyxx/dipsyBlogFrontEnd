import React, { useEffect, useState } from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { SelectIsAuth } from "../../redux/slices/auth";
import { useSelector } from "react-redux";
import axios from "../../axios";

export const Index = () => {
  const isAuth = useSelector(SelectIsAuth);
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    axios.get("/auth/me").then(({ data }) => {
      setAvatarUrl(data.avatarUrl);
    });
  }, []);
  return (
    <>
      <div className={styles.root}>
        <Avatar classes={{ root: styles.avatar }} src={avatarUrl} />
        <div className={styles.form}>
          <TextField
            label="Написати коментар"
            variant="outlined"
            maxRows={10}
            multiline
            fullWidth
          />
          <Button variant="contained">Відправити</Button>
        </div>
      </div>
    </>
  );
};
