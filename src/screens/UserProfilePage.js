import React, {useContext} from "react";
import Header from "../components/Header";
import {useParams, Link} from "react-router-dom";
import "../css/userProfilePage.css";
import UsersContext from "../context/UsersContext";
function UserProfilePage() {
		let users = useContext(UsersContext);
		let {id} = useParams();
		let userProfileData = users.filter(item => parseInt(id) === parseInt(item._id))
		console.log(userProfileData)
	return (
		<div>
			<Header />
			{	

				userProfileData.map(item => {
					
							return (
						<div className="user-profile-page">
							<h2>{item.fullName}'s Profile</h2>
							<p>Name: {item.fullName}</p>
							<p>Handle: {item.handle}</p>
							<p>Age {item.age}</p>
							<p>Following: {item.follows.map(item => <span>{item.fullName},</span>)}</p>	
							<button>
								<Link to={"/users"}>Back</Link>
							</button>					
						</div>
					)
					}
				
				)
			}
		</div>
	);
}
export default UserProfilePage;
