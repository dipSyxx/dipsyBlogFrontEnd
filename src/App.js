import Container from "@mui/material/Container";

import { useEffect } from "react";
import { Header } from "./components";
import { Home, FullPost, Registration, AddPost, Login } from "./pages";

import { Routes, Route } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { SelectIsAuth, fetchAuthMe } from "./redux/slices/auth";

function App() {
  const dispatch = useDispatch();
  //? Перевірка чи увійшли ми в аккаунт
  const isAuth = useSelector(SelectIsAuth);

  useEffect(() => {
    dispatch(fetchAuthMe());
  }, []);

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<FullPost />} />
          <Route path="/posts/:id/edit" element={<AddPost />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
