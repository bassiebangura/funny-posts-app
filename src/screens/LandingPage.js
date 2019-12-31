import React from "react";
import {Link} from "react-router-dom";
import "../css/landingPage.css";
import Header from "../components/Header"
function LandingPage() {
	return (
		<div>
			<Header />
			<h2>
				<Link to="/users">View Users</Link>
			</h2>
		</div>
	);
}
export default LandingPage;
