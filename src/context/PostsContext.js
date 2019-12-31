import { createContext } from "react";
const PostsContext = createContext({
	posts: []
});
export const PostsProvider = PostsContext.Provider;
export default PostsContext;
