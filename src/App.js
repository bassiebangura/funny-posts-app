import React, { useState, useEffect } from "react";
import { flureeFetch } from "./flureeFetch";
import "./App.css";

function App() {
	const [posts, setPosts] = useState({
		individualPostsAndComments: [],
		followsPostsAndComments: []
	});
	const updatePosts = ({
		individualPostsAndComments,
		followsPostsAndComments
	}) =>
		setPosts(prevState => ({
			...prevState,
			individualPostsAndComments,
			followsPostsAndComments
		}));

	const refreshPosts = id => {
		console.log(id);
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
		return flureeFetch("/query", query)
			.then(res => {
				//console.log(res)
				if (!res) {
					throw new Error("Error fetching posts.");
				}
				const { follows, posts } = res;

				const individualPostsAndComments = posts.map(item => ({
					message: item.message,
					comments: generateArrayOfCommentsMessage(item.comments),
					likes: item.likes,
					totalComments: generateArrayOfCommentsMessage(item.comments).length
				}));

				const followsPosts = follows.map(item => item.posts);
				const followsPostsAndComments = followsPosts.map(item => ({
					message: item[0].message,
					comments: generateArrayOfCommentsMessage(item[0].comments),
					likes: item[0].likes,
					totalComments: generateArrayOfCommentsMessage(item[0].comments).length
				}));

				updatePosts({
					individualPostsAndComments,
					followsPostsAndComments
				});
				//console.log(followsPostsAndComments);
			})
			.catch(err => {
				console.log(err);
				// debugger;
			});
	};
	useEffect(() => {
		refreshPosts();
	}, [setPosts]);

	const handleSubmit = e => {
		refreshPosts(e.target.id);
	};

	const handleHideAndShow = () => {
		console.log("You clicked hide or show");
	};
	const [users, setUsers] = useState([]);

	const getUsers = () => {
		const query = {
			select: ["fullName", "handle"],
			from: "person"
		};

		return flureeFetch("/query", query)
			.then(res => {
				if (!res) {
					throw new Error("Error fetching posts.");
				}
				const fullNamesAndId = res.map(item => item);
				setUsers(fullNamesAndId);
			})
			.catch(err => {
				console.log(err);
				//debugger;
			});
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
				<div className="posts-and-comments-container">
					{posts.individualPostsAndComments.map(item => (
						<div className="posts-container">
							<p>{item.message}</p>
							<div className="posts-comments">
								<p className="comments-header">
									<span onClick={handleHideAndShow}>Comments</span>
									<span> {item.totalComments}</span>
									<span> Likes</span>
									<span> {item.likes}</span>
								</p>
								{item.comments.map(item => (
									<p className="comment-message">{item}</p>
								))}
							</div>
						</div>
					))}

					{posts.followsPostsAndComments.map(item => (
						<div className="posts-container">
							<p>{item.message}</p>
							<div className="posts-comments">
								<p className="comments-header">
									<span onClick={handleHideAndShow}>Comments</span>
									<span> {item.totalComments}</span>
									<span> Likes</span>
									<span> {item.likes}</span>
								</p>
								{item.comments.map(item => (
									<p className="comment-message">{item}</p>
								))}
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
