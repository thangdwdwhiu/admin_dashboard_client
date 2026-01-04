

export const getFullUrl = (path) => {
  if (!path) return null

  
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000"


  if (path.startsWith("http://") || path.startsWith("https://")) return path
console.log(`${baseUrl}${path}`);


  return `${baseUrl}${path}`
}
