import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";

import styles from "./Login.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { SelectIsAuth, fetchRegister } from "../../redux/slices/auth";

export const Registration = () => {
  const dispatch = useDispatch();

  const isAuth = useSelector(SelectIsAuth);
  console.log("Auth", isAuth);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullName: "Dasha Hershun",
      email: "dashaHershun@gmail.com",
      password: "12345678910",
    },
    mode: "all",
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchRegister(values));

    if (!data.payload) {
      return alert("Не вдалося зареєструватись");
    }

    if ("token" in data.payload) {
      window.localStorage.setItem("token", data.payload.token);
    }
  };

  useEffect(() => {}, []);

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Створення акаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          helperText={errors.fullName?.message}
          error={Boolean(errors.fullName?.message)}
          {...register("fullName", { required: "Вкажіть повне ім'я" })}
          className={styles.field}
          label="Повне ім'я"
          fullWidth
        />
        <TextField
          helperText={errors.email?.message}
          error={Boolean(errors.email?.message)}
          {...register("email", { required: "Вкажіть почту" })}
          className={styles.field}
          label="E-Mail"
          fullWidth
        />
        <TextField
          helperText={errors.password?.message}
          error={Boolean(errors.password?.message)}
          {...register("password", { required: "Вкажіть пароль" })}
          className={styles.field}
          label="Пароль"
          fullWidth
        />

        <Button
          disabled={!isValid}
          type="submit"
          size="large"
          variant="contained"
          fullWidth
        >
          Зареєструватись
        </Button>
      </form>
    </Paper>
  );
};
