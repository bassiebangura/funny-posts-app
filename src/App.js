import React, { useState, useEffect } from "react";
import { flureeFetch } from "./flureeFetch";
import { FaRegComments, FaRegThumbsUp } from "react-icons/fa";
import "./App.css";

function App() {
	const [posts, setPosts] = useState({
		postsAndComments: [],
		currentUserId: null,
		showAddNewPost: false
	});

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

	const refreshPosts = async id => {
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
			//console.log(res)
			if (!res) {
				throw new Error("Error fetching posts.");
			}
			//console.log(res);
			const { follows, posts } = res;
			const individualPostsAndComments = posts.map(item => ({
				postId: item._id,
				message: item.message,
				comments: item.comments
					? generateArrayOfCommentsMessage(item.comments)
					: [],
				likes: item.likes,
				totalComments: item.comments
					? generateArrayOfCommentsMessage(item.comments).length
					: 0
			}));
			const followsPostsNested = follows.map(item => item.posts);
			const followsPosts = followsPostsNested.flat();
			const followsPostsAndComments = followsPosts.map(item => ({
				postId: item._id,
				message: item.message,
				comments: item.comments
					? generateArrayOfCommentsMessage(item.comments)
					: [],
				likes: item.likes,
				totalComments: item.comments
					? generateArrayOfCommentsMessage(item.comments).length
					: 0
			}));
			const postsAndComments = [
				...individualPostsAndComments,
				...followsPostsAndComments
			];
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
	// useEffect(() => {
	// 	refreshPosts();
	// }, [setPosts]);

	const handleSubmit = e => {
		//console.log(e);
		refreshPosts(e.target.id);
		getUsers(e.target.id);
	};

	const addLikes = async e => {
		e.preventDefault();
		// console.log(e);
		// console.log(e.target);

		const postId = parseInt(e.target.id);
		if (postId) {
			let currentLikes = posts.postsAndComments.filter(
				item => item.postId === postId
			)[0].likes;

			const transaction = [
				{
					_id: postId,
					likes: currentLikes + 1
				}
			];
			try {
				const res = await flureeFetch("/transact", transaction);
				// console.log(res);
				refreshPosts(posts.currentUserId);
				if (!res) {
					throw new Error("Error transacting transaction.");
				}
			} catch (err) {
				console.log(err);
			}
		}
	};

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
			//console.log(res);
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
	const [showCommentButton, setShowCommentButton] = useState({
		displayCommentButton: false,
		isDisabledCommentButton: true
	});
	const handleNewCommentOnFocus = () => {
		// setShowCommentButton({
		// 	displayCommentButton: true,
		// 	isDisabledCommentButton: true
		// });
		// setNewComment({
		// 	newCommentValue: ""
		// });
	};
	// const [newComment, setNewComment] = useState({
	// 	newCommentValue: "Leave your comment here.."
	// });

	// const handleNewCommentOnChange = e => {
	// 	setNewComment({
	// 		newCommentValue: e.target.value
	// 	});

	// 	setShowCommentButton({
	// 		displayCommentButton: true,
	// 		isDisabledCommentButton: e.target.value ? false : true
	// 	});
	// };
	// const handleCommentSubmit = async e => {
	// 	e.preventDefault();
	// 	let newCommentMessage = newComment.newCommentValue;
	// 	const transaction = [
	// 		{
	// 			_id: "post$1",
	// 			"post/message": newCommentMessage,
	// 			"post/person": parseInt(posts.currentUserId),
	// 			"post/likes": 0,
	// 			"post/comments": []
	// 		},
	// 		{
	// 			_id: parseInt(posts.currentUserId),
	// 			"person/posts": ["post$1"]
	// 		}
	// 	];

	// 	try {
	// 		const res = await flureeFetch("/transact", transaction);
	// 		//console.log(res);
	// 		refreshPosts(posts.currentUserId);
	// 		setNewComment({
	// 			newCommentValue: ""
	// 		});
	// 		// setShowPostButton({
	// 		// 	displayPostButton: true,
	// 		// 	isDisabledPostButton: true
	// 		// });
	// 		if (!res) {
	// 			throw new Error("Error transacting transaction.");
	// 		}
	// 	} catch (err) {
	// 		console.log(err);
	// 	}
	// };

	return (
		<div className="App">
			<header className="App-header">
				<h1>Funny Post App</h1>
			</header>
			<div className="users-and-posts-wrapper">
				<div className="timeline-wrapper">
					{posts.showAddNewPost ? (
						<div className="add-new-post-textarea-and-post-button-wrapper">
							<form className="addNewPostForm" onSubmit={handlePostSubmit}>
								<textarea
									className="addNewPost"
									onFocus={() => handldeOnFocus()}
									onChange={handleNewPostOnChange}
									value={newPost.newPostValue}
								></textarea>
								{showPostButton.displayPostButton ? (
									<button
										disabled={showPostButton.isDisabledPostButton}
										className="addNewPostButton"
										type="submit"
									>
										Post
									</button>
								) : (
									""
								)}
							</form>
						</div>
					) : (
						" "
					)}

					{posts.postsAndComments.map(item => (
						<div className="posts-container">
							<div className="post-message-comments-likes-icon-container">
								<p className="post-message left-align">{item.message}</p>
								<div className="comments-likes-wrapper left-align">
									<div className="comments-icon-total-comments-wrapper">
										<span className="comments-icon">
											<FaRegComments />
										</span>
										<span className="total-comments">{item.totalComments}</span>
									</div>
									<div className="likes-icon-total-likes-wrapper">
										<span className="likes-icon">
											<FaRegThumbsUp
												id={item.postId}
												onClick={addLikes}
												className="likes-icon-svg"
											/>
										</span>
										<span className="total-likes"> {item.likes}</span>
									</div>
								</div>
							</div>
							<div className="post-comments">
								{item.totalComments
									? item.comments.map(item => (
											<p className="comment-message speech-bubble">{item}</p>
									  ))
									: ""}
								<div className="add-new-comment-textarea-and-comment-button-wrapper">
									<form
										className="addCommentForm"
										// onSubmit={handleCommentSubmit}
									>
										<textarea
											name={item.postId}
											className="addNewPost"
											onFocus={() => handleNewCommentOnFocus()}
											// onChange={handleNewCommentOnChange}
											// value={newComment.newCommentValue}
										></textarea>
										{showCommentButton.displayCommentButton ? (
											<button
												// disabled={showCommentButton.isDisabledCommentButton}
												className="addNewPostButton"
												type="submit"
											>
												Comment
											</button>
										) : (
											""
										)}
									</form>
								</div>
							</div>
						</div>
					))}
				</div>

				<div className="users-container">
					{users.map(item => {
						return (
							<button
								onClick={handleSubmit}
								id={item._id}
								key={item._id}
								className="users-button"
								disabled={item.isDisabled}
							>
								{item.fullName}
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default App;
