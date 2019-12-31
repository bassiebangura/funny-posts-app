import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import UsersContext from "../context/UsersContext";
import PostsContext from "../context/PostsContext";
import Header from "../components/Header"

function UsersPage() {
	let users = useContext(UsersContext);
	//let {refreshPosts} = useContext(PostsContext)
	return (
		<div className="landing-page-wrapper">
			<Header />
			<div className="users-container">
				{users.map(item => {
					return (
						<div className="individual-user">
							<h2>{item.fullName}</h2>
							<button
								id={item._id}
								key={item._id}
								className="users-button"
								disabled={item.isDisabled}
							>
								<Link to={`/users/timeline/${item._id}`}> View {item.fullName}'s Timeline</Link>
							</button>
						</div>
					);
				})}
			</div>
		</div>
	);
	
}

export default UsersPage;
