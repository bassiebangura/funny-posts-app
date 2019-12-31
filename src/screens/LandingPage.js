import React, {useContext} from "react";
import {Link} from "react-router-dom";
import "../css/landingPage.css";
import Header from "../components/Header";
import PostsContext from "../context/PostsContext"
function LandingPage() {
    // let {posts, refreshPosts} = useContext(PostsContext)
    // console.log(refreshPosts)
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
