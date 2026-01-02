export default function filterUserlist(list = [], filters = { role: 'all', keyword: '' }){
    if (!Array.isArray(list)) return []
    const keyword = (filters.keyword || '').toString().trim().toLowerCase()
    const role = (filters.role || 'all').toString()

    return list.filter(user => {
       
        if (role !== 'all'){
            const roleVal = role
           
            if (String(user.role_id) !== String(roleVal) && (user.role_name || '').toLowerCase() !== String(roleVal).toLowerCase()) return false
        }
        if (!keyword) return true
        const name = (user.full_name || '').toString().toLowerCase()
        const email = (user.email || '').toString().toLowerCase()
        return name.includes(keyword) || email.includes(keyword)
    })
}
