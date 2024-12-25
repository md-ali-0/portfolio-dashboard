export function formatDate(dateString: string) {
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const date = new Date(dateString);
    
    // Get the date components
    const day = String(date.getDate()).padStart(2, "0"); // Ensure 2 digits for the day
    const month = months[date.getMonth()]; // Get the abbreviated month name
    const year = date.getFullYear(); // Get the full year

    // Combine the parts into the desired format
    return `${day} ${month} ${year}`;
}