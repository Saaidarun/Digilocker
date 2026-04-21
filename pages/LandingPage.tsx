import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Share2, Globe, ChevronRight } from 'lucide-react';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
                <div className="flex items-center space-x-2">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900 tracking-tight">DigiLocker</span>
                </div>

                {/* Top Right Login Option */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/login')}
                        className="px-5 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                    >
                        Get Started
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1">
                <section className="relative overflow-hidden pt-20 pb-32">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-50/50 rounded-full blur-3xl -z-10"></div>

                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <div className="inline-flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full text-blue-600 text-sm font-medium mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            <span>Secure Cloud Storage v2.0 is live</span>
                        </div>

                        <h1 className="text-6xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
                            Secure your digital life <br />
                            <span className="text-blue-600">in one place.</span>
                        </h1>

                        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Store, share, and access your important documents from anywhere in the world.
                            Bank-grade encryption ensures your data remains yours, always.
                        </p>

                        <div className="flex items-center justify-center space-x-4">
                            <button
                                onClick={() => navigate('/register')}
                                className="px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 flex items-center group"
                            >
                                Start for free
                                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                                    <Lock className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Bank-Grade Security</h3>
                                <p className="text-gray-500 leading-relaxed">
                                    Your files are encrypted using industry-standard AES-256 encryption. We prioritize your privacy above all else.
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6 text-green-600">
                                    <Share2 className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Seamless Sharing</h3>
                                <p className="text-gray-500 leading-relaxed">
                                    Share documents safely with friends, family, or colleagues. Control access permissions with a single click.
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6 text-purple-600">
                                    <Globe className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Access Anywhere</h3>
                                <p className="text-gray-500 leading-relaxed">
                                    Whether you're on your phone, tablet, or computer, your files are always within reach.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <ShieldCheck className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-500 font-semibold">DigiLocker Secure</span>
                    </div>
                    <div className="flex space-x-8 text-sm text-gray-400">
                        <a href="#" className="hover:text-gray-600">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-600">Terms of Service</a>
                        <a href="#" className="hover:text-gray-600">Contact Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
