export default function createClientSocket() {
    let socket = io("http://localhost:3000", { withCredentials: false });
    return socket;
}

