import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { RegisterUser } from '../api'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await RegisterUser(form)
      login(res.data.user, res.data.token)
      navigate('/')
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-center h-full bg-gray-800 text-white'>
      <form onSubmit={handleSubmit} className='w-full max-w-sm p-6 flex flex-col gap-4'>
        <h1 className='text-2xl font-outfit text-center mb-2'>Register</h1>
        {error && <p className='text-red-400 text-sm text-center'>{error}</p>}
        <input
          type="text"
          placeholder='Name'
          className='h-12 rounded-lg border-2 px-4 py-2 bg-transparent'
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder='Email'
          className='h-12 rounded-lg border-2 px-4 py-2 bg-transparent'
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder='Password'
          className='h-12 rounded-lg border-2 px-4 py-2 bg-transparent'
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className='bg-emerald-500 rounded-lg px-6 py-2 mt-2 disabled:opacity-50'
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>
        <p className='text-center text-sm'>
          Already have an account? <Link to="/login" className='text-blue-400 underline'>Login</Link>
        </p>
      </form>
    </div>
  )
}

export default Register