import React, { useState, useEffect } from "react";
import Person from "./models/person";
import { flureeFetch } from "./flureeFetch";
import "./App.css";
//query for post by individual and the posts of all the people the individual follows
// {
//   "select": [
//     {
//       "posts": [
//         "message",
//         {
//           "comments": [
//              {
//                 "comment/person": ["fullName"]
//             },
//             "message"
//           ]
//         }
//       ]
//     },
//     {
//       "follows": [
//         {
//           "posts": [
//             "message",
//             {
//               "comments": [
//                 {
//                 "comment/person": ["fullName"]
//             },
//             "message"
//               ]
//             }
//           ]
//         }
//       ]
//     }
//   ],
//   "from": ["person/handle", "jsuleman"]
// }

function App() {
	// const [individualPosts, setIndividualsPosts] = useState([]);
	// const [followsPostsMessages, setFollowsPosts] = useState([]);
	const [posts, setPosts] = useState({
		individualPostsMessages: [],
		followsPostMessages: []
	});
	const updatePosts = ({ individualPostsMessages, followsPostMessages }) =>
		setPosts(prevState => ({
			...prevState,
			individualPostsMessages,
			followsPostMessages
    }));
  
	const refreshPosts = () => {
		const query = {
			select: [
				"fullName",
				{
					posts: [
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
			from: ["person/handle", "jsuleman"]
    };
    
    let generateArrayOfCommentsMessage = arrayOfComments => {
			let mapping = arrayOfComments.map(item => {
				return item.message;
			});
			return mapping;
		};
		return flureeFetch("/query", query)
			.then(res => {
				if (!res) {
					throw new Error("Error fetching posts.");
				}
				const { follows, posts } = res;

				const arrayOfIndividualPosts = posts.map(item => item.message);
				const individualPostsComments = posts.map(item => item.comments);



				const individualPostsAndComments = posts.map(item => ({
					message: item.message,
					comments: generateArrayOfCommentsMessage(item.comments)
        }));
        // (function displayPostAndComments() {
        //   let mapping = individualPostsAndCommentsObject.map(item => {
        //     let commentsMessage = []
        //     item.comments.forEach(element => {
        //       console.log(element)
        //        return commentsMessage.push(element.message)
        //     });
            
        //     return (
        //       commentsMessage
        //     )
        //   })
        //   console.log(mapping)
        // }
        // )();

        

				const followsPosts = follows.map(item => item.posts);
				const arrayOfFollowsPosts = followsPosts.map(
					(item, index) => item[0].message
				);
				const testFollowsPosts = followsPosts.map((item, index) => ({
					message: item[0].message,
					comments: item[0].comments
				}));
				console.log(posts);
				console.log(individualPostsAndComments);
				//   console.log(follows);
				//   console.log(followsPosts);
				// console.log(testFollowsPosts)
				//console.log(individualPostsComments)
				updatePosts({
					individualPostsMessages: arrayOfIndividualPosts,
					followsPostMessages: arrayOfFollowsPosts
				});
			})
			.catch(err => {
				console.log(err);
				debugger;
			});
	};
	useEffect(() => {
		//refreshPosts();
	}, [posts]);

	// const [CEGroups, setCEGroups] = useState({
	// 	CEGroups: [],
	// 	operators: [],
	// 	updateCEGroups: CEGroups =>
	// 		setCEGroups(prevState => ({ ...prevState, CEGroups }))
	// });
	// useEffect(() => {
	// 	const query = {
	// 		select: [
	// 			"*",
	// 			{ "CEGroup/products": ["*"] },
	// 			{ "CEGroup/operators": ["name", "_id"] }
	// 		],
	// 		from: "CEGroup"
	// 	};
	// 	flureeFetch("/query", query)
	// 		.then(res => {
	// 			if (!res) {
	// 				throw new Error("Error fetching products.");
	// 			}
	// 			//const modelCEGroups = res.map(c => new CEGroup(c));
	// 			//CEGroups.updateCEGroups(modelCEGroups);
	// 		})
	// 		.catch(err => {
	// 			debugger;
	// 		});
	// });

	// let testEndPoint = () => {
	// 	let query = {
	// 		select: [
	// 			"fullName",
	// 			{
	// 				posts: [
	// 					"message",
	// 					{
	// 						comments: [
	// 							{
	// 								"comment/person": ["fullName"]
	// 							},
	// 							"message"
	// 						]
	// 					}
	// 				]
	// 			},
	// 			{
	// 				follows: [
	// 					"fullName",
	// 					{
	// 						posts: [
	// 							"message",
	// 							{
	// 								comments: [
	// 									{
	// 										"comment/person": ["fullName"]
	// 									},
	// 									"message"
	// 								]
	// 							}
	// 						]
	// 					}
	// 				]
	// 			}
	// 		],
	// 		from: ["person/handle", "jsuleman"]
	// 	};

	// 	flureeFetch("/query", query)
	// 		.then(res => {
	//       let {follows, posts } = res;

	// 			let arrayOfIndividualPosts = posts.map(item => item.message);
	// 			let followsPosts = follows.map(item => item.posts);
	// 			let arrayOfFollowsPosts = followsPosts.map(
	// 				(item, index) => item[0].message
	// 			);

	// 			console.log(arrayOfIndividualPosts);
	// 			console.log(arrayOfFollowsPosts);

	// 			if (!res) {
	// 				throw new Error("Error fetching products.");
	// 			}
	// 		})
	// 		.catch(err => {
	// 			debugger;
	// 		});

	// };

	//console.log(posts)
	return (
		<div className="App">
			<header className="App-header">
				<div>
					<h1>hello gang</h1>
					<button onClick={() => refreshPosts()}>Click To Get Post</button>

					{/* {posts.individualPostsMessages.map(item => (
						<p>{item}</p>
          ))} */}
					{posts.followsPostMessages.map(item => (
						<p>{item}</p>
					))}
				</div>
			</header>
		</div>
	);
}

export default App;
