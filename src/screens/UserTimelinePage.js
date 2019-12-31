import React, {useContext} from "react";
import PostsContext from "../context/PostsContext";
import {useParams} from "react-router-dom";
import Header from "../components/Header"
function UserTimelinePage() {
 const posts = useContext(PostsContext)
 console.log(posts)
    const {id} = useParams()
	return (
		<div>
			<Header />
        	<div className="timeline-wrapper">
					
						<div className="add-new-post-textarea-and-post-button-wrapper">
							<form className="addNewPostForm" >
								<textarea
									className="addNewPost"
									// onFocus={() => handldeOnFocus()}
									// onChange={handleNewPostOnChange}
									// value={newPost.newPostValue}
								></textarea>
						
									<button
										//disabled={showPostButton.isDisabledPostButton}
										className="addNewPostButton"
										type="submit"
									>
										Post
									</button>
							
							</form>
						</div>
				

					{posts.postsAndComments.map(item => (
						<div className="posts-container">
							<div className="post-message-comments-likes-icon-container">
								<p className="post-message left-align">{item.message}</p>
								<div className="comments-likes-wrapper left-align">
									<div className="comments-icon-total-comments-wrapper">
										<span className="comments-icon">
										comments
										</span>
										<span className="total-comments">{item.totalComments}</span>
									</div>
									<div className="likes-icon-total-likes-wrapper">
										<span className="likes-icon">
									
                                            thumbs
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
												//onFocus={e => handleNewCommentOnFocus(e)}
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

							{/* end */}
						</div>
					))}
				</div>
		</div>
	);
}
export default UserTimelinePage;
