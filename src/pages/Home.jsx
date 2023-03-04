import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";

import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, fetchTags } from "../redux/slices/posts";

export const Home = () => {
  const [value, setValue] = useState(0);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags } = useSelector((state) => state.posts);

  const isPostsLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
  }, []);

  console.log(posts);

  const handleSwitchPopularity = () => {
    setValue(1);
  };
  const handleSwitchNew = () => {
    setValue(0);
  };

  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={value}
        aria-label="basic tabs example"
      >
        <Tab onClick={handleSwitchNew} label="Нові" />
        <Tab onClick={handleSwitchPopularity} label="Популярні" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {value === 0
            ? (isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) =>
                isPostsLoading ? (
                  <Post key={index} isLoading={true} />
                ) : (
                  <Post
                    _id={obj._id}
                    title={obj.title}
                    imageUrl={
                      obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ""
                    }
                    user={obj.user}
                    createdAt={obj.createdAt}
                    viewsCount={obj.viewsCount}
                    commentsCount={3}
                    tags={obj.tags}
                    isEditable={userData?._id === "63f4a6d3f31dc420832e52d8"}
                  />
                )
              )
            : ""}

          {value === 1
            ? posts.items
                .filter((post) => post.viewsCount > 5)
                .sort((a, b) => a.viewsCount - b.viewsCount)
                .map((post, index) =>
                  isPostsLoading ? (
                    <Post key={index} isLoading={true} />
                  ) : (
                    <Post
                      _id={post._id}
                      title={post.title}
                      imageUrl={
                        post.imageUrl
                          ? `http://localhost:4444${post.imageUrl}`
                          : ""
                      }
                      user={post.user}
                      createdAt={post.createdAt}
                      viewsCount={post.viewsCount}
                      commentsCount={3}
                      tags={post.tags}
                      isEditable={userData?._id === "63f4a6d3f31dc420832e52d8"}
                    />
                  )
                )
            : ""}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: "Юра Лінецький",
                  avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
                },
                text: "Тест коментар",
              },
              {
                user: {
                  fullName: "Олег Подоляк",
                  avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
                },
                text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
