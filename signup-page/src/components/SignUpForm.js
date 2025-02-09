import React, { useState } from 'react';
import '../Style/signupform.css';

//used to set the values according to user input
const SignupFrom = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', { name, email, password ,passwordConfirm});
    };

    return (
        <div className="signup-section">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div className="group">
                    <label htmlFor="name">user name :</label>
                    <input type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
             
                <div className="group">
                    <label htmlFor="email">AUB email:</label>
                    <input type="text"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
    
                <div className="group">
                    <label htmlFor="password">password:</label>
                    <input type="text"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="group">
                    <label htmlFor="passwordConfirm">confirm password:</label>
                    <input type="text"
                        id="passwordConfirm"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Sign Up</button>
            </form>
        </div>

    );
};
export default SignupFrom;