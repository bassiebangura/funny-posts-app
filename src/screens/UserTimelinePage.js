import React, { useContext, useState } from "react";
import PostsContext from "../context/PostsContext";
import { flureeFetch } from "../flureeFetch";
import { FaRegComments, FaRegThumbsUp } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
function UserTimelinePage() {
	const {
		postsAndComments,
		currentUserId,
		showAddNewPost,
		newComment,
		updatePosts,
		refreshPosts
	} = useContext(PostsContext);

	// const { id } = useParams();
	// //refreshPosts(id)
	// console.log(postsAndComments);

	/***********************************************************
	 ***************** Add Post Section  ***********************
	 ***********************************************************/

	const [showPostButton, setShowPostButton] = useState({
		displayButton: false,
		isDisabledPostButton: true
	});
	const [newPost, setNewPost] = useState({
		newPostValue: "Leave a funny post.."
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
				"post/person": parseInt(currentUserId),
				"post/likes": 0,
				"post/comments": []
			},
			{
				_id: parseInt(currentUserId),
				"person/posts": ["post$1"]
			}
		];

		try {
			const res = await flureeFetch("/transact", transaction);

			refreshPosts(currentUserId);
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
		let arrayOfPostsAndComments = postsAndComments;
		let arrayOfPostsAndCommentsUpdated = arrayOfPostsAndComments.map(item => {
			return {
				...item,
				isDisabledCommentButton: commentPostId === item.postId ? true : false,
				showCommentButton: commentPostId === item.postId ? true : false
			};
		});
		let postsAndComments = arrayOfPostsAndCommentsUpdated;
		updatePosts(prevState => ({
			...prevState,
			postsAndComments
		}));
	};

	// const handleNewCommentOnChange = e => {
	// 	let commentPostId = parseInt(e.target.name);
	// 	let newCommentValue = e.target.value;
	// 	let arrayOfPostsAndComments = posts.postsAndComments; //must refactor
	// 	let arrayOfPostsAndCommentsUpdated = arrayOfPostsAndComments.map(item => {
	// 		return {
	// 			...item,
	// 			isDisabledCommentButton: e.target.value ? false : true,
	// 			newComment:
	// 				commentPostId === item.postId ? newCommentValue : item.newComment
	// 		};
	// 	});
	// 	let postsAndComments = arrayOfPostsAndCommentsUpdated;
	// 	setPosts(prevState => ({
	// 		...prevState,
	// 		postsAndComments
	// 	}));

	// 	// setShowCommentButton({
	// 	// 	displayCommentButton: true,
	// 	// 	isDisabledCommentButton: e.target.value ? false : true
	// 	// });
	// };
	const handleDisplayComments = e => {
		e.preventDefault();

		//console.log(e.target.id);
		let commentPostId = parseInt(e.target.id);
		let arrayOfPostsAndComments = postsAndComments; //must refactor
		let arrayOfPostsAndCommentsUpdated = arrayOfPostsAndComments.map(item => {
			return {
				...item,
				showPostComments:
					commentPostId === item.postId
						? !item.showPostComments
						: item.showPostComments
			};
		});
		const showAddNewPost = true;
		let postsAndComments = arrayOfPostsAndCommentsUpdated;
		updatePosts({
			postsAndComments,
			currentUserId,
			showAddNewPost
		});
	};
	// const handleCommentSubmit = async e => {
	// 	e.preventDefault();
	// 	let commentPostId = parseInt(e.target.name);
	// 	let newComment = posts.postsAndComments.filter(
	// 		item => item.postId === parseInt(commentPostId)
	// 	)[0].newComment;
	// 	const transaction = [
	// 		{
	// 			_id: commentPostId,
	// 			"post/comments": ["comment$1"]
	// 		},
	// 		{
	// 			_id: "comment$1",
	// 			"comment/person": parseInt(posts.currentUserId),
	// 			"comment/message": newComment
	// 		}
	// 	];

	// 	try {
	// 		const res = await flureeFetch("/transact", transaction);

	// 		refreshPosts(posts.currentUserId);
	// 		let arrayOfPostsAndComments = posts.postsAndComments; //must refactor
	// 		let arrayOfPostsAndCommentsUpdated = arrayOfPostsAndComments.map(item => {
	// 			return {
	// 				...item,
	// 				showPostComments:
	// 					commentPostId === item.postId ? false : item.showPostComments
	// 			};
	// 		});
	// 		let postsAndComments = arrayOfPostsAndCommentsUpdated;
	// 		setPosts(prevState => ({
	// 			...prevState,
	// 			postsAndComments
	// 		}));

	// 		if (!res) {
	// 			throw new Error("Error transacting transaction.");
	// 		}
	// 	} catch (err) {
	// 		console.log(err);
	// 	}
	// };

	return (
		<div>
			<Header />
			<div className="timeline-wrapper">
				{showAddNewPost ? (
					<div className="add-new-post-textarea-and-post-button-wrapper">
						<form className="addNewPostForm" onSubmit={handlePostSubmit}>
							<textarea
								className="addNewPost"
								onFocus={() => handldeOnFocus()}
								onChange={handleNewPostOnChange}
								value={newPost.newPostValue}
							></textarea>

							<button
								disabled={showPostButton.isDisabledPostButton}
								className="addNewPostButton"
								type="submit"
							>
								Post
							</button>
						</form>
					</div>
				) : (
					""
				)}
				{postsAndComments.map(item => (
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
										<FaRegThumbsUp />
									</span>
									<span className="total-likes"> {item.likes}</span>
								</div>
							</div>
						</div>
						{item.showPostComments ? (
							<div className="post-comments">
								{item.totalComments
									? item.comments.map(item => (
											<p className="comment-message speech-bubble">{item}</p>
									  ))
									: ""}
								<div className="add-new-comment-textarea-and-comment-button-wrapper">
									<form
										name={item.postId}
										className="addCommentForm"
										//onSubmit={handleCommentSubmit}
									>
										<textarea
											name={item.postId}
											className="addNewPost"
											onFocus={e => handleNewCommentOnFocus(e)}
											//onChange={handleNewCommentOnChange}
											value={item.newComment}
											placeholder="Leave a comment..."
										></textarea>
										{item.showCommentButton ? (
											<button
												disabled={item.isDisabledCommentButton}
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
						) : (
							""
						)}
					</div>
				))}
			</div>
		</div>
	);
}
export default UserTimelinePage;
