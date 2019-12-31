import { createContext } from "react";
const PostsContext = createContext({
	postsAndComments: [],
	currentUserId: null,
    showAddNewPost: false,
    updatePosts: () => {},
	refreshPosts: () => {}
});
export const PostsProvider = PostsContext.Provider;
export default PostsContext;
