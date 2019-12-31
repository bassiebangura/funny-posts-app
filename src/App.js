import React, { useState, useEffect } from "react";
import { flureeFetch } from "./flureeFetch";

import UsersContext, {UsersProvider} from "./context/UsersContext";
import PostsContext, { PostsProvider } from "./context/PostsContext";
import LandingPage from "./screens/LandingPage";
import UsersPage from "./screens/UsersPage";
import UserProfile from "./screens/UserProfilePage";
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
	const refreshPosts = async id => {
    console.log("Who is calling me")
		const query = {
			select: [
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
					showPostComments: false,
					showCommentButton: false,
					isDisabledCommentButton: true,
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
			showAddNewPost,
			newPost
		}) =>
			setPosts(prevState => ({
				...prevState,
				postsAndComments,
				currentUserId,
				showAddNewPost,
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
			select: ["_id", "fullName", "handle"],
			from: "person"
		};

		try {
			const res = await flureeFetch("/query", query);
			if (!res) {
				throw new Error("Error fetching posts.");
			}
			const fullNamesAndId = res.map(item => ({
				...item,
				isDisabled: parseInt(id) === parseInt(item._id) ? true : false
			})); //disable user with current posts showing.
			setUsers(fullNamesAndId);
		} catch (err) {
			console.log(err);
		}
	};
	useEffect(() => {
		getUsers();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [setUsers]);

	const handleViewUserTimeline = e => {
		refreshPosts(e.target.id);
		//getUsers(e.target.id);
	};

	const addLikes = async e => {
		e.preventDefault();

		const postId = parseInt(e.target.id);
		//console.log(e.target);
		if (postId) {
			let currentLikes = posts.postsAndComments.filter(
				item => item.postId === postId
			)[0].likes;

			const transaction = [
				{
					_id: postId,
					likes: `#(inc ${currentLikes})`
				}
			];
			try {
				const res = await flureeFetch("/transact", transaction);
				refreshPosts(posts.currentUserId);
				if (!res) {
					throw new Error("Error transacting transaction.");
				}
			} catch (err) {
				console.log(err);
			}
		}
	};

	/***********************************************************
	 ***************** Add Post Section  ***********************
	 ***********************************************************/

	const [showPostButton, setShowPostButton] = useState({
		displayButton: false,
		isDisabledPostButton: true
	});
	const handldeOnFocus = () => {
		setShowPostButton({
			displayPostButton: true,
			isDisabledPostButton: true
		});
		setNewPost({
			newPostValue: ""
		});
	};

	const [newPost, setNewPost] = useState({
		newPostValue: "Leave a funny post.."
	});
	const handleNewPostOnChange = e => {
		setNewPost({
			newPostValue: e.target.value
		});

		setShowPostButton({
			displayPostButton: true,
			isDisabledPostButton: e.target.value ? false : true
		});
	};

	const handlePostSubmit = async e => {
		e.preventDefault();
		let newPostMessage = newPost.newPostValue;
		const transaction = [
			{
				_id: "post$1",
				"post/message": newPostMessage,
				"post/person": parseInt(posts.currentUserId),
				"post/likes": 0,
				"post/comments": []
			},
			{
				_id: parseInt(posts.currentUserId),
				"person/posts": ["post$1"]
			}
		];

		try {
			const res = await flureeFetch("/transact", transaction);

			refreshPosts(posts.currentUserId);
			setNewPost({
				newPostValue: ""
			});
			setShowPostButton({
				displayPostButton: true,
				isDisabledPostButton: true
			});
			if (!res) {
				throw new Error("Error transacting transaction.");
			}
		} catch (err) {
			console.log(err);
		}
	};

	/***********************************************************
	 ******************* Add Comment Section ********************
	 ***********************************************************/

	const handleNewCommentOnFocus = e => {
		let commentPostId = parseInt(e.target.name);
		let arrayOfPostsAndComments = posts.postsAndComments; //must refactor
		let arrayOfPostsAndCommentsUpdated = arrayOfPostsAndComments.map(item => {
			return {
				...item,
				isDisabledCommentButton: commentPostId === item.postId ? true : false,
				showCommentButton: commentPostId === item.postId ? true : false
			};
		});
		let postsAndComments = arrayOfPostsAndCommentsUpdated;
		setPosts(prevState => ({
			...prevState,
			postsAndComments
		}));
	};

	const handleNewCommentOnChange = e => {
		let commentPostId = parseInt(e.target.name);
		let newCommentValue = e.target.value;
		let arrayOfPostsAndComments = posts.postsAndComments; //must refactor
		let arrayOfPostsAndCommentsUpdated = arrayOfPostsAndComments.map(item => {
			return {
				...item,
				isDisabledCommentButton: e.target.value ? false : true,
				newComment:
					commentPostId === item.postId ? newCommentValue : item.newComment
			};
		});
		let postsAndComments = arrayOfPostsAndCommentsUpdated;
		setPosts(prevState => ({
			...prevState,
			postsAndComments
		}));

		// setShowCommentButton({
		// 	displayCommentButton: true,
		// 	isDisabledCommentButton: e.target.value ? false : true
		// });
	};
	const handleDisplayComments = e => {
		e.preventDefault();

		//console.log(e.target.id);
		let commentPostId = parseInt(e.target.id);
		let arrayOfPostsAndComments = posts.postsAndComments; //must refactor
		let arrayOfPostsAndCommentsUpdated = arrayOfPostsAndComments.map(item => {
			return {
				...item,
				showPostComments:
					commentPostId === item.postId
						? !item.showPostComments
						: item.showPostComments
			};
		});
		let postsAndComments = arrayOfPostsAndCommentsUpdated;
		setPosts(prevState => ({
			...prevState,
			postsAndComments
		}));
	};
	const handleCommentSubmit = async e => {
		e.preventDefault();
		let commentPostId = parseInt(e.target.name);
		let newComment = posts.postsAndComments.filter(
			item => item.postId === parseInt(commentPostId)
		)[0].newComment;
		const transaction = [
			{
				_id: commentPostId,
				"post/comments": ["comment$1"]
			},
			{
				_id: "comment$1",
				"comment/person": parseInt(posts.currentUserId),
				"comment/message": newComment
			}
		];

		try {
			const res = await flureeFetch("/transact", transaction);

			refreshPosts(posts.currentUserId);
			let arrayOfPostsAndComments = posts.postsAndComments; //must refactor
			let arrayOfPostsAndCommentsUpdated = arrayOfPostsAndComments.map(item => {
				return {
					...item,
					showPostComments:
						commentPostId === item.postId ? false : item.showPostComments
				};
			});
			let postsAndComments = arrayOfPostsAndCommentsUpdated;
			setPosts(prevState => ({
				...prevState,
				postsAndComments
			}));

			if (!res) {
				throw new Error("Error transacting transaction.");
			}
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<PostsProvider value={posts}>
			<UsersProvider value={users}>
				<Router>
					<Switch>
						<Route exact path="/">
							<LandingPage />
						</Route>
						<Route exact path="/users">
							<UsersPage handleOnClick={handleViewUserTimeline} />
						</Route>
						<Route path="/users/profile/:id">
							<UserProfile />
						</Route>
						<Route path="/users/timeline/:id">
							<UserTimeline />
						</Route>
					</Switch>
				</Router>
			</UsersProvider>
		</PostsProvider>

		// <div className="App">
		// 	<header className="App-header">
		// 		<h1>Funny Post App</h1>
		// 	</header>
		// 	<div className="users-and-posts-wrapper">
		// 		<div className="timeline-wrapper">
		// 			{posts.showAddNewPost ? (
		// 				<div className="add-new-post-textarea-and-post-button-wrapper">
		// 					<form className="addNewPostForm" onSubmit={handlePostSubmit}>
		// 						<textarea
		// 							className="addNewPost"
		// 							onFocus={() => handldeOnFocus()}
		// 							onChange={handleNewPostOnChange}
		// 							value={newPost.newPostValue}
		// 						></textarea>
		// 						{showPostButton.displayPostButton ? (
		// 							<button
		// 								disabled={showPostButton.isDisabledPostButton}
		// 								className="addNewPostButton"
		// 								type="submit"
		// 							>
		// 								Post
		// 							</button>
		// 						) : (
		// 							""
		// 						)}
		// 					</form>
		// 				</div>
		// 			) : (
		// 				" "
		// 			)}

		// 			{posts.postsAndComments.map(item => (
		// 				<div className="posts-container">
		// 					<div className="post-message-comments-likes-icon-container">
		// 						<p className="post-message left-align">{item.message}</p>
		// 						<div className="comments-likes-wrapper left-align">
		// 							<div className="comments-icon-total-comments-wrapper">
		// 								<span className="comments-icon">
		// 									<FaRegComments
		// 										id={item.postId}
		// 										onClick={handleDisplayComments}
		// 										className="comments-icon-svg"
		// 									/>
		// 								</span>
		// 								<span className="total-comments">{item.totalComments}</span>
		// 							</div>
		// 							<div className="likes-icon-total-likes-wrapper">
		// 								<span className="likes-icon">
		// 									<FaRegThumbsUp
		// 										id={item.postId}
		// 										onClick={addLikes}
		// 										className="likes-icon-svg"
		// 									/>
		// 								</span>
		// 								<span className="total-likes"> {item.likes}</span>
		// 							</div>
		// 						</div>
		// 					</div>
		// 					{item.showPostComments ? (
		// 						<div className="post-comments">
		// 							{item.totalComments
		// 								? item.comments.map(item => (
		// 										<p className="comment-message speech-bubble">{item}</p>
		// 								  ))
		// 								: ""}
		// 							<div className="add-new-comment-textarea-and-comment-button-wrapper">
		// 								<form
		// 									name={item.postId}
		// 									className="addCommentForm"
		// 									onSubmit={handleCommentSubmit}
		// 								>
		// 									<textarea
		// 										name={item.postId}
		// 										className="addNewPost"
		// 										onFocus={e => handleNewCommentOnFocus(e)}
		// 										onChange={handleNewCommentOnChange}
		// 										value={item.newComment}
		// 										placeholder="Leave a comment..."
		// 									></textarea>
		// 									{item.showCommentButton ? (
		// 										<button
		// 											disabled={item.isDisabledCommentButton}
		// 											className="addNewPostButton"
		// 											type="submit"
		// 										>
		// 											Comment
		// 										</button>
		// 									) : (
		// 										""
		// 									)}
		// 								</form>
		// 							</div>
		// 						</div>
		// 					) : (
		// 						""
		// 					)}

		// 					{/* end */}
		// 				</div>
		// 			))}
		// 		</div>

		// 		<div className="users-container">
		// 			{users.map(item => {
		// 				return (
		// 					<button
		// onClick={handleViewUserTimeline}
		// 						id={item._id}
		// 						key={item._id}
		// 						className="users-button"
		// 						disabled={item.isDisabled}
		// 					>
		// 						{item.fullName}
		// 					</button>
		// 				);
		// 			})}
		// 		</div>
		// 	</div>
		// </div>
	);
}

export default App;
