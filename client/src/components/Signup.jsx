import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { BASE_URL } from '../constants';
import toast from 'react-hot-toast';

export default function Signup() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  async function onSubmit(data) {
    console.log(data);
    const response = await fetch(`${BASE_URL}/api/v1/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    const json = await response.json();
    console.log(json);
    if (response.ok) {
      toast.success(json.message);
      navigate('/');
    } else {
      toast.error(json.error);
    }
    reset();
  }

  console.log(errors);

  return (
    <div className='container px-5 py-24 mx-auto flex items-center justify-center w-screen h-screen'>
      <form
        className='lg:w-1/3 md:w-1/2 bg-white rounded-lg p-8 flex flex-col w-full mt-10 md:mt-0 relative z-10 shadow-md'
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className='text-gray-900 text-lg mb-1 font-medium title-font'>
          Signup
        </h2>

        <div className='relative mb-4'>
          <label htmlFor='name' className='leading-7 text-sm text-gray-600'>
            Name
          </label>
          <input
            type='text'
            id='name'
            {...register('name', { required: 'Name is required' })}
            className='w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
          />
          {errors.name && (
            <p className='text-xs bg-red-200 rounded-sm mt-1 px-2 text-red-800 py-1'>
              {errors.name.message}
            </p>
          )}
          <label htmlFor='email' className='leading-7 text-sm text-gray-600'>
            Email
          </label>
          <input
            type='email'
            id='email'
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value:
                  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
                message: 'Invalid email address',
              },
            })}
            className='w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
          />
          {errors.email && (
            <p className='text-xs bg-red-200 rounded-sm mt-1 px-2 text-red-800 py-1'>
              {errors.email.message}
            </p>
          )}
        </div>
        <div className='relative mb-4'>
          <label htmlFor='password' className='leading-7 text-sm text-gray-600'>
            password
          </label>
          <input
            type='password'
            id='password'
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
            })}
            className='w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
          />
          {errors.password && (
            <p className='text-xs bg-red-200 rounded-sm mt-1 px-2 text-red-800 py-1'>
              {errors.password.message}
            </p>
          )}
          <label
            htmlFor='passwordConfirm'
            className='leading-7 text-sm text-gray-600'
          >
            confirm password
          </label>
          <input
            type='password'
            id='passwordConfirm'
            {...register('passwordConfirm', {
              required: 'Confirm password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
            })}
            className='w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
          />
          {errors.passwordConfirm && (
            <p className='text-xs bg-red-200 rounded-sm mt-1 px-2 text-red-800 py-1'>
              {errors.passwordConfirm.message}
            </p>
          )}
        </div>
        <button
          type='submit'
          className='text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg'
        >
          Signup
        </button>
        <p className='text-xs text-gray-500 mt-3'>
          If you already have an account, please <Link to='/login'>login</Link>.
        </p>
      </form>
    </div>
  );
}
