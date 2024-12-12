import { useState } from 'react'; 
import { Link } from 'react-router-dom'; 
import Header from '../Header/Header';
import toast from 'react-hot-toast';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubmitted(true);
        toast.success("Password sent in taken Email")
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <Header />
      <form onSubmit={handleSubmit} className="form-forget">
        <h2>Forgot Password</h2>
        {!submitted ? (
          <>
            <div className='input-groups'>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit">Submit</button>
          </>
        ) : (
          <p>If an account with that <Link to="/">Email</Link> exists, a reset link has been sent</p>
        )}
      </form>
    </div>
  );
}

export default ForgotPassword;
