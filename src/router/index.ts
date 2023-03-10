import { createRouter, createWebHistory } from "vue-router";
import { useGlobalState, Post } from "../store/index";
import Home from "../views/Home.vue";
import Blog from "../views/Blog.vue";

let blogs = useGlobalState().posts;

let posts = [];
posts.push({ path: "", name: "blog", component: Blog });
const modules = import.meta.glob("../../posts/**/*.md");

for (let i in modules) {
  let item = modules[i];
  const post_path = item.name.replace(/(.*[post]\/)(.*)\..*/gi, "$2");
  modules[item.name]().then(res => {
    const date = new Date((res as Post).date);
    blogs.value.push({
      title: (res as Post).title,
      category: (res as Post).category,
      date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      desc: (res as Post).desc,
      path: post_path,
    });
  }),
    posts.push({
      path: "/blog/" + post_path,
      name: post_path,
      component: modules[item.name],
    });
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      redirect: "/blog",
      // component: Home,
    },
    {
      path: "/blog",
      children: posts,
    },
  ],
});

export default router;
