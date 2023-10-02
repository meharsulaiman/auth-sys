import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <div className='container px-5 py-24 mx-auto flex items-center justify-center w-screen h-screen'>
      <div className='lg:w-1/3 md:w-1/2 bg-white rounded-lg p-8 flex flex-col w-full mt-10 md:mt-0 relative z-10 shadow-md'>
        <h2 className='text-gray-900 text-lg mb-1 font-medium title-font'>
          Login
        </h2>

        <div className='relative mb-4'>
          <label htmlFor='email' className='leading-7 text-sm text-gray-600'>
            Email
          </label>
          <input
            type='email'
            id='email'
            name='email'
            className='w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
          />
        </div>
        <div className='relative mb-4'>
          <label htmlFor='password' className='leading-7 text-sm text-gray-600'>
            password
          </label>
          <input
            type='password'
            id='password'
            name='password'
            className='w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
          />
        </div>
        <button className='text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg'>
          Login
        </button>
        <p className='text-xs text-gray-500 mt-3'>
          If you do not have an account, please <Link to='/signup'>signup</Link>
          .
        </p>
      </div>
    </div>
  );
}
