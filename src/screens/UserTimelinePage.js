import React, { useContext, useState, useEffect,  } from "react";
import PostsContext from "../context/PostsContext";
import { flureeFetch } from "../flureeFetch";
import { FaRegComments, FaRegThumbsUp } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Header from "../components/Header";

function UserTimelinePage() {
	const contextValue = useContext(PostsContext);
	const {
		postsAndComments,
		currentUserId,
		updatePosts,
		refreshPosts
	} = useContext(PostsContext);

	const { id } = useParams();

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
				"post/comments": [],
				"post/instant": "#(now)"
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
		let arrayOfPostsAndComments = contextValue.postsAndComments;
		let arrayOfPostsAndCommentsUpdated = arrayOfPostsAndComments.map(item => {
			//console.log(item)
			return {
				...item,
				isDisabledCommentButton: commentPostId === item.postId ? true : false,
				showCommentButton: commentPostId === item.postId ? true : false
			};
		});
		let currentUserId = contextValue.currentUserId
		let postsAndComments = arrayOfPostsAndCommentsUpdated;
		updatePosts({
			postsAndComments,
			currentUserId
		});
	};

	const handleNewCommentOnChange = e => {
		let commentPostId = parseInt(e.target.name);
		let newCommentValue = e.target.value;

		let arrayOfPostsAndComments = contextValue.postsAndComments; //must refactor
		let arrayOfPostsAndCommentsUpdated = arrayOfPostsAndComments.map(item => {
			return {
				...item,
				showCommentButton: commentPostId === item.postId ? true : false,
				isDisabledCommentButton: e.target.value ? false : true,
				newComment:
					commentPostId === item.postId ? newCommentValue : item.newComment
			};
		});

		let currentUserId = contextValue.currentUserId// we add currentUserId because the updatePosts fxn is expecting it if not it will be undefined
		let postsAndComments = arrayOfPostsAndCommentsUpdated;
		updatePosts({
				postsAndComments,
			currentUserId
		
		});

	};
	const handleDisplayComments = e => {
		e.preventDefault();

		//console.log(e.target.id);
		let commentPostId = parseInt(e.target.id);
			let arrayOfPostsAndComments = contextValue.postsAndComments;

		
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

	const handleCommentSubmit = async e => {
		e.preventDefault();
		let commentPostId = parseInt(e.target.name);
		let newComment = contextValue.postsAndComments.filter(
			item => item.postId === parseInt(commentPostId)
		)[0].newComment;
		const transaction = [
			{
				_id: commentPostId,
				"post/comments": ["comment$1"]
			},
			{
				_id: "comment$1",
				"comment/person": parseInt(currentUserId),
				"comment/message": newComment
			}
		];

		try {
			const res = await flureeFetch("/transact", transaction);

		
		refreshPosts(currentUserId, commentPostId)
			
	
	
			if (!res) {
				throw new Error("Error transacting transaction.");
			}
		} catch (err) {
			console.log(err);
		}
			
	

	};
		const addLikes = async e => {
		e.preventDefault();

		const postId = parseInt(e.target.id);
		if (postId) {
			let currentLikes = postsAndComments.filter(
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
				refreshPosts(currentUserId);
				if (!res) {
					throw new Error("Error transacting transaction.");
				}
			} catch (err) {
				console.log(err);
			}
		}
	};
		useEffect(() => {
		refreshPosts(id)
	
	}, [])

	return (
		<div>
			<Header />
			<div className="timeline-wrapper">
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
				
				{postsAndComments.map(item => (
					<div className="posts-container">
						<div className="post-message-comments-likes-icon-container">
							<p className="post-person">Posted by {item.person} <span>{item.date}</span></p>
							<p className="post-message left-align">{item.message}</p>
							<div className="comments-likes-wrapper left-align">
								<div className="comments-icon-total-comments-wrapper">
									<span className="comments-icon">
										<FaRegComments
											id={item.postId}
											onClick={handleDisplayComments}
											className="comments-icon-svg"
										/>
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
						{item.showPostComments ? (
							<div className="post-comments">
								{item.totalComments
									? item.comments.map(item => (
										<>
											<p className="comment-message speech-bubble">{item.message}</p>
											<p className="person-comment">comment by {item.person}</p>
										</>
									  ))
									: ""}
								<div className="add-new-comment-textarea-and-comment-button-wrapper">
								
										<textarea
											name={item.postId}
											className="addNewPost"
											onFocus={e => handleNewCommentOnFocus(e)}
											onChange={handleNewCommentOnChange}
											value={item.newComment}
											placeholder="Leave a comment..."
										></textarea>
										{item.showCommentButton ? (
											<button
												name={item.postId}
												onClick={handleCommentSubmit}
												className="addNewPostButton"
												disabled={item.isDisabledCommentButton}
												
											>
												Comment
											</button>
										) : (
											""
										)}
									
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
