import User from "../models/User.js";

/* READ */
export const getUser = async (req,res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        res.status(200).json(user);

    } catch (error) {
        res.status(404).json({message: error.message});
    }
}


export const getUserFriends = async (req,res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
    
        //Grab the friends 
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        
        const formatedFriends = friends.map(({_id,firstName,lastName,occupation,location,picturePath}) => {
            return {_id,firstName,lastName,occupation,location,picturePath};
        });
    
        res.status(200).json(formatedFriends);

    } catch (error) {
        res.status(404).json({message: error.message});   
    }
 
}

export const addRemoveFriend = async (req,res) => {
    try {
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if (user.friends.includes(friendId)) {
            //Remove friend from a friend list
            user.friends = user.friends.filter((id) => id !== friendId);
            //Remove you from other users friend list as well
            friend.friends = friend.friends.filter((id) => id !== id);
        } else {
            //Add  friend to friends list
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        
        const formatedFriends = friends.map(({_id,firstName,lastName,occupation,location,picturePath}) => {
            return {_id,firstName,lastName,occupation,location,picturePath};
        });
    
        res.status(200).json(formatedFriends);

    } catch (error) {
        res.status(404).json({message: error.message});   
    }
}