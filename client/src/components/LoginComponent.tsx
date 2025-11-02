import React from 'react'
import { useNavigate } from 'react-router-dom'

const LoginComponent = () => {
    const navigate = useNavigate()

    const handleGuestLogin = () => {
        navigate('/dashboard')
    }

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
            <div className="w-full max-w-5xl bg-white overflow-hidden flex h-[600px]">
                {/* Left Side - Visual Section */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-tr from-[#5a7a51] to-[#7a917a] justify-center items-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-black opacity-20"></div>
                    <div className="relative z-10 px-10 text-center">
                        <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center mb-8 shadow-lg">
                            <svg className="w-12 h-12 text-[#5a7a51]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-4">CuraLynx</h1>
                        <p className="text-white/80 text-lg mb-8">HIPAA-compliant secure access for healthcare professionals. Your patients' data is protected with enterprise-grade encryption.</p>
                        <div className="flex justify-center space-x-4">
                            <div className="w-3 h-3 rounded-full bg-white/30"></div>
                            <div className="w-3 h-3 rounded-full bg-white"></div>
                            <div className="w-3 h-3 rounded-full bg-white/30"></div>
                        </div>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 border-white/30 rounded-full"></div>
                    <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 border-white/30 rounded-full"></div>
                    <div className="absolute top-0 -right-20 w-80 h-80 border-4 border-white/30 rounded-full"></div>
                </div>

                {/* Right Side - Form Section */}
                <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8 overflow-y-hidden">
                    <div className="w-full max-w-md">
                        <div className="text-center lg:text-left">
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Back</h2>
                            <p className="text-gray-600 mb-8">Please sign in to your account</p>
                        </div>

                        <form className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input type="email" id="email" name="email" className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="example@mail.com" />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <input type="password" id="password" name="password" className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="••••••••" />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">Remember me</label>
                                </div>
                                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">Forgot password?</a>
                            </div>

                            <div>
                                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    Sign In
                                </button>
                            </div>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">or continue with</span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <button onClick={handleGuestLogin} className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                    <span className="ml-2">Guest</span>
                                </button>
                                <button className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                                    </svg>
                                    <span className="ml-2">Google</span>
                                </button>
                            </div>
                        </div>

                        <p className="mt-8 text-center text-sm text-gray-600">
                            Don't have an account?
                            <a href="#" className="font-medium text-blue-600 hover:text-blue-500"> Sign up now</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginComponent