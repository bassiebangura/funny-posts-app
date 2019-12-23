import React, {Fragment} from 'react';


const Users = ({arrayOfUsersFullnames}) => {
        return (
					<>
						<div>
							{
                                arrayOfUsersFullnames.map((item, key) => <button>{item.fullName}</button>)
                            }
						</div>
					</>
				);
}


export default Users;