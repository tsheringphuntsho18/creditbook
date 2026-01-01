
export const formatDate = (isoString: string): string => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    // A robust, readable format. Example: Aug 23, 2024, 5:30 PM
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch (error) {
    // Fallback for any unexpected invalid date string
    console.error("Could not format date:", isoString, error);
    return isoString; 
  }
};
