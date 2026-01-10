export const AVATARS = [
  { id: 'avatar1', emoji: '😊', bgColor: '#fef3c7' },
  { id: 'avatar2', emoji: '😎', bgColor: '#dbeafe' },
  { id: 'avatar3', emoji: '🦊', bgColor: '#fed7aa' },
  { id: 'avatar4', emoji: '🐱', bgColor: '#fce7f3' },
  { id: 'avatar5', emoji: '🦁', bgColor: '#fef9c3' },
  { id: 'avatar6', emoji: '🐼', bgColor: '#e5e7eb' },
  { id: 'avatar7', emoji: '🦄', bgColor: '#f3e8ff' },
  { id: 'avatar8', emoji: '🐸', bgColor: '#d1fae5' },
  { id: 'avatar9', emoji: '🤖', bgColor: '#cffafe' },
  { id: 'avatar10', emoji: '👻', bgColor: '#f1f5f9' },
  { id: 'avatar11', emoji: '🌟', bgColor: '#fef08a' },
  { id: 'avatar12', emoji: '🔥', bgColor: '#fecaca' },
];

export const getAvatarById = (id) => {
  if (!id) return AVATARS[0];
  const found = AVATARS.find(avatar => avatar.id === id);
  return found || AVATARS[0];
};