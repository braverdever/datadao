const formatDateTime = (timestamp) => {
  if (!timestamp) return 'Not available';
  return new Date(Number(timestamp)).toLocaleString();
};

const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'Not available';
  
  const now = Date.now();
  const diff = now - Number(timestamp);
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 4) return `${weeks}w ago`;
  return `${months}mo ago`;
};

const formatDuration = (hours) => {
  if (!hours) return 'Not available';
  
  if (hours >= 720) { // 30 days
    return `${Math.floor(hours / 720)}mo`;
  } else if (hours >= 168) { // 1 week
    return `${Math.floor(hours / 168)}w`;
  } else if (hours >= 24) { // 1 day
    return `${Math.floor(hours / 24)}d`;
  }
  return `${hours.toFixed(0)}h`;
};

export {
  formatDateTime,
  formatTimeAgo,
  formatDuration
}; 