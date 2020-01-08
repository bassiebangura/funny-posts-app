import React, { useState, useEffect } from "react";
import { flureeFetch } from "./flureeFetch";

import {UsersProvider} from "./context/UsersContext";
import { PostsProvider } from "./context/PostsContext";
import LandingPage from "./screens/LandingPage";
import UsersPage from "./screens/UsersPage";
import UserProfilePage from "./screens/UserProfilePage";
import UserTimeline from "./screens/UserTimelinePage";

import {
	BrowserRouter as Router,
	Route,
	Switch,
	useLocation,
	useHistory
} from "react-router-dom";
import "./App.css";


function App() {
	const refreshPosts = async (id, commentPostId) => {
		const query = {
			select: [
				{
					posts: [
						"likes",
						"message",
						"instant",
						{
							comments: [
								{
									"comment/person": ["fullName"]
								},
								"message"
							]
						}
					]
				},
				{
					follows: [
						"fullName",
						{
							posts: [
								"likes",
								"message",
								{
									comments: [
										{
											"comment/person": ["fullName"]
										},
										"message"
									]
								}
							]
						}
					]
				}
			],
			from: parseInt(id)
		};

		let generateArrayOfCommentsMessage = arrayOfComments => {
			let mapping = arrayOfComments.map(item => {
				return item.message;
			});
			return mapping;
		};
		try {
			let res = await flureeFetch("/query", query);
			if (!res) {
				throw new Error("Error fetching posts.");
			}
			console.log(res)
			const { follows, posts } = res;
			const followsPostsNested = follows.map(item => item.posts);
			const followsPostsAndComments = followsPostsNested.flat();
			const postsAndComments = [...posts, ...followsPostsAndComments].map(
				item => ({
					postId: item._id,
					message: item.message,
					comments: item.comments
						? generateArrayOfCommentsMessage(item.comments)
						: [],
					likes: item.likes,
					totalComments: item.comments
						? generateArrayOfCommentsMessage(item.comments).length
						: 0,
					showPostComments: item._id === parseInt(commentPostId) ? true: false,
					showCommentButton: false,
					newComment: ""
				})
			);
			const currentUserId = id;
			const showAddNewPost = true;
			updatePosts({
				postsAndComments,
				currentUserId,
				showAddNewPost
			});
		} catch (err) {
			console.log(err);
    }
    
  };
  	const updatePosts = ({
			postsAndComments,
			currentUserId,
			newPost
		}) =>
			setPosts(prevState => ({
				...prevState,
				postsAndComments,
				currentUserId,
				newPost
			}));
	// useEffect(() => {
	// 	posts.refreshPosts();
	// }, [posts.updatePosts]);
	const [posts, setPosts] = useState({
		postsAndComments: [],
		currentUserId: null,
    showAddNewPost: false,
    updatePosts: updatePosts,
		refreshPosts: refreshPosts
	});



	const [users, setUsers] = useState([]);

	const getUsers = async id => {
		const query = {
			    "select": [
        "_id",
        "fullName",
        "handle",
        "age",
        {
            "follows": [
                "fullName"]
        }
        ],
    "from": "person"
		};

		try {
			const res = await flureeFetch("/query", query);
			if (!res) {
				throw new Error("Error fetching posts.");
			}
			const fullNamesAndId = res.map(item => ({
				...item
			})); 
			setUsers(fullNamesAndId);
		} catch (err) {
			console.log(err);
		}
	};
	useEffect(() => {
		getUsers();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [setUsers]);

	


	return (
		<PostsProvider value={posts}>
			<UsersProvider value={users}>
				<Router>
					<Switch>
						<Route exact path="/">
							<LandingPage />
						</Route>
						<Route exact path="/users">
							<UsersPage  />
						</Route>
						<Route path="/users/profile/:id">
							<UserProfilePage />
						</Route>
						<Route path="/users/timeline/:id">
							<UserTimeline />
						</Route>
					</Switch>
				</Router>
			</UsersProvider>
		</PostsProvider>
	);
}

export default App;
