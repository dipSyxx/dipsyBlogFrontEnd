import React, { useEffect } from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { SelectIsAuth } from "../../redux/slices/auth";
import { useSelector } from "react-redux";
import axios from "../../axios";

export const AddPost = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const isAuth = useSelector(SelectIsAuth);

  const [isLoading, setLoading] = React.useState(false);

  const [text, setText] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");

  const inputFileRef = React.useRef(null);

  //? перевірка якщо елемент редактується {isEditing ? "Зберегти" : "Опублікувати"}
  const isEditing = Boolean(id);

  //функція провіряє чи змінилось щось в інпуті чи ні
  const handleChangeFile = async (event) => {
    try {
      // Позволяє вшивати картинку в бекенд
      const formData = new FormData();
      const file = event.target.files[0];
      // Картінку передаєм на сервак
      formData.append("image", file);
      // візьми цей файл зроби пост запрос на бекенд '/upload' візьми formData в якому знаходиться картинка відправ його на сервак
      const { data } = await axios.post("/upload", formData);
      // якщо все успішно дай силку і сохрани
      setImageUrl(data.url);
    } catch (error) {
      console.warn(error);
      alert("Помилка під час завантаження файлу");
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl("");
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      setLoading(true);

      const fields = {
        title,
        imageUrl,
        tags,
        text,
      };

      // передаєм отримавшу інфу на бекенд
      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post("/posts", fields);

      // отримуємо айдішку картинки
      const _id = isEditing ? id : data._id;

      // і якщо успішно створена перекидуєм користувача на цей пост
      navigate(`/posts/${_id}`);
    } catch (error) {
      console.warn(error);
      alert("Не вдалося сворити статю");
    }
  };

  useEffect(() => {
    if (id) {
      axios.get(`/posts/${id}`).then(({ data }) => {
        setTitle(data.title);
        setText(data.text);
        setImageUrl(data.imageUrl);
        setTags(data.tags.join(","));
      });
    }
  }, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Ведіть текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button
        // ось це те саме що клацати на ось це <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden/>
        onClick={() => inputFileRef.current.click()}
        variant="outlined"
        size="large"
      >
        Завантажити прев'ю
      </Button>
      <input
        ref={inputFileRef}
        type="file"
        onChange={handleChangeFile}
        hidden
      />
      {imageUrl && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
          >
            Удалить
          </Button>
          <img
            className={styles.image}
            src={`http://localhost:4444${imageUrl}`}
            alt="Uploaded"
          />
        </>
      )}

      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статі..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Теги"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? "Зберегти" : "Опублікувати"}
        </Button>
        <Link to="/">
          <Button size="large">Відмінити</Button>
        </Link>
      </div>
    </Paper>
  );
};
