import { useSelector } from 'react-redux';

function Welcome() {
    const { username } = useSelector((state) => state.user);

    return (username ? <p>Welcome, {username}!</p> : null);
}

export default Welcome;
