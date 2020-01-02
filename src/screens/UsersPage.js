import React, { useContext} from "react";
import { Link } from "react-router-dom";
import UsersContext from "../context/UsersContext";
//import PostsContext from "../context/PostsContext";
import Header from "../components/Header"

function UsersPage() {
	let users = useContext(UsersContext);

	return (
		<div className="landing-page-wrapper">
			<Header />
			<div className="users-container">
				{users.map(item => {
					return (
						<div className="individual-user" key={item._id}>
							<p>
								<Link to={`/users/profile/${item._id}`}> View {item.fullName}'s Profile</Link>
							</p>
							<p
								id={item._id}
				
							>
								<Link to={`/users/timeline/${item._id}`}> View {item.fullName}'s Timeline</Link>
							</p>
						</div>
					);
				})}
			</div>
		</div>
	);
	
}

export default UsersPage;
