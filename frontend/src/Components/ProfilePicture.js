import React from 'react';
import Avatar from 'react-avatar';

const ProfilePicture = ({ name }) => {
  return (
    <Avatar 
      name={name} 
      size="100" // Avatar size
      round={true} // Makes the avatar circular
      color={Avatar.getRandomColor(name, ['red', 'green', 'blue', 'orange'])} // Generates consistent colors
    />
  );
};

export default ProfilePicture;
