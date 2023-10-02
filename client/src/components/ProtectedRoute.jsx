import { useEffect } from 'react';
import { BASE_URL } from '../constants';
import { useNavigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  useEffect(
    function () {
      async function fetchData() {
        const response = await fetch(`${BASE_URL}/api/v1/auth/me`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MWE1ODU3Mzk1ZTQ0NTVlODUzYWJjNiIsImlhdCI6MTY5NjIyNTM2NywiZXhwIjoxNjk2NDg0NTY3fQ.m5WVVlIY0eP0i5c6dwLy1aweT3nhZqNEEReE6_VL5mA`,
          },
        });

        console.log(response);
        if (response.status !== 200) {
          navigate('/login');
        } else {
          const data = await response.json();
          console.log(data);
        }
      }

      fetchData();
    },
    [navigate]
  );
  return children;
}
