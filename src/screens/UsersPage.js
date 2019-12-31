import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UsersContext from "../context/UsersContext";
import Header from "../components/Header"

function UsersPage({handleOnClick}) {
	let users = useContext(UsersContext);
	return (
		<div className="landing-page-wrapper">
			<Header />
			<div className="users-container">
				{users.map(item => {
					return (
						<div className="individual-user">
							<button>Profile</button>
							<button
								onClick={handleOnClick}
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
