import React, { useState, useEffect } from "react";
import { flureeFetch } from "./flureeFetch";
import { FaRegComments, FaRegThumbsUp } from "react-icons/fa";
import "./App.css";

function App() {
	const [posts, setPosts] = useState({
		postsAndComments: [],
    currentUserId: null
	});


	const updatePosts = ({ postsAndComments, currentUserId }) =>
		setPosts(prevState => ({
			...prevState,
			postsAndComments,
			currentUserId
		}));

	const refreshPosts = async (id) => {
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
        id: item._id,
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
      updatePosts({
        postsAndComments,
        currentUserId
      });
    }
    catch (err) {
      console.log(err);
    }
	};
	// useEffect(() => {
	// 	refreshPosts();
	// }, [setPosts]);

	const handleSubmit = e => {
    refreshPosts(e.target.id);
    getUsers(e.target.id)
	};

	// const handleHideAndShow = () => {
	// 	console.log("hello")
	// };
	const [users, setUsers] = useState([]);

	const getUsers = async (id) => {
		const query = {
			select: ["_id", "fullName", "handle"],
			from: "person"
		};

		try {
      const res = await flureeFetch("/query", query);
      if (!res) {
        throw new Error("Error fetching posts.");
      }
      const fullNamesAndId = res.map(item => ({ ...item, isDisabled: parseInt(id) === parseInt(item._id) ? true : false }));
      setUsers(fullNamesAndId);
    }
    catch (err) {
      console.log(err);
    }
	};
	useEffect(() => {
		getUsers();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [setUsers]);
	
	return (
		<div className="App">
			<header className="App-header">
				<h1>Funny Post App</h1>
			</header>
			<div className="users-and-posts-wrapper">
				<div className="timeline-wrapper">
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
											{" "}
											<FaRegThumbsUp />
										</span>
										<span className="total-likes"> {item.likes}</span>
									</div>
								</div>
							</div>
							{true ? (
								<div className="post-comments">
									{item.totalComments
										? item.comments.map(item => (
												<p className="comment-message speech-bubble">{item}</p>
										  ))
										: ""}
								</div>
							) : (
								" "
							)}
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
