export async function logout() {
    try {
        const res = await fetch('/api/auth/logout')
        window.location = '/'
    } catch(err) {
        console.log('Failed to logout', err)
    }
}