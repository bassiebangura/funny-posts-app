import React, {useContext} from "react";
import UsersContext from "../context/UsersContext"

function LandingPage() {
    let users = useContext(UsersContext)
    return (
			<div className="users-container">
				{users.map(item => {
					return (
                        <>
                        <p>User: {item.fullName}</p>
                        <button>Profile</button>
						<button
							// onClick={handleSubmit}
							id={item._id}
							key={item._id}
							className="users-button"
							disabled={item.isDisabled}
						>
							View {item.fullName}'s Timeline
						</button>
                        </>
					);
				})}
			</div>
		);
}
export default LandingPage;