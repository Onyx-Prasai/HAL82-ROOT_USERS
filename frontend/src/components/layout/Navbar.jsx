import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { TrendingUp, Users, Zap, Briefcase, Microscope, Info, LogOut } from 'lucide-react';
import logo from '../../assets/logo.png';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md border border-slate-200 shadow-lg rounded-full px-3 py-1.5 z-50 flex items-center space-x-2">
            <NavLink to="/dashboard" className="flex items-center group px-1">
                <img src={logo} alt="Sangam Logo" className="w-14 h-14 object-contain rounded-full group-hover:scale-105 transition-transform mix-blend-multiply" />
            </NavLink>

            <div className="w-[1px] h-6 bg-slate-200 mx-1"></div>

            <NavLink
                to="/dashboard"
                className={({ isActive }) => `flex items-center space-x-2 px-3 py-1.5 rounded-full font-bold transition-all ${isActive ? 'bg-emerald-50 text-sangam-emerald' : 'text-slate-500 hover:text-sangam-slate hover:bg-slate-50'}`}
            >
                <TrendingUp size={18} />
                <span className="hidden sm:block text-sm">Uthan</span>
            </NavLink>

            <NavLink
                to="/matcher"
                className={({ isActive }) => `flex items-center space-x-2 px-3 py-1.5 rounded-full font-bold transition-all ${isActive ? 'bg-emerald-50 text-sangam-emerald' : 'text-slate-500 hover:text-sangam-slate hover:bg-slate-50'}`}
            >
                <Users size={18} />
                <span className="hidden sm:block text-sm">Jodi</span>
            </NavLink>

            <NavLink
                to="/pulse"
                className={({ isActive }) => `flex items-center space-x-2 px-3 py-1.5 rounded-full font-bold transition-all ${isActive ? 'bg-emerald-50 text-sangam-emerald' : 'text-slate-500 hover:text-sangam-slate hover:bg-slate-50'}`}
            >
                <Zap size={18} />
                <span className="hidden sm:block text-sm">Pulse</span>
            </NavLink>

            <NavLink
                to="/syndicate"
                className={({ isActive }) => `flex items-center space-x-2 px-3 py-1.5 rounded-full font-bold transition-all ${isActive ? 'bg-emerald-50 text-sangam-emerald' : 'text-slate-500 hover:text-sangam-slate hover:bg-slate-50'}`}
            >
                <Briefcase size={18} />
                <span className="hidden sm:block text-sm">Syndicate</span>
            </NavLink>

            <NavLink
                to="/marketplace"
                className={({ isActive }) => `flex items-center space-x-2 px-3 py-1.5 rounded-full font-bold transition-all ${isActive ? 'bg-emerald-50 text-sangam-emerald' : 'text-slate-500 hover:text-sangam-slate hover:bg-slate-50'}`}
            >
                <Microscope size={18} />
                <span className="hidden sm:block text-sm">Experts</span>
            </NavLink>

            <div className="w-[1px] h-6 bg-slate-200 mx-1"></div>

            <NavLink
                to="/vision"
                className={({ isActive }) => `flex items-center space-x-2 px-3 py-1.5 rounded-full font-bold transition-all ${isActive ? 'bg-emerald-50 text-sangam-emerald' : 'text-slate-500 hover:text-sangam-slate hover:bg-slate-50'}`}
            >
                <Info size={18} />
                <span className="hidden sm:block text-sm">Vision</span>
            </NavLink>

            <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-1.5 rounded-full font-bold text-red-500 hover:bg-red-50 transition-all cursor-pointer"
            >
                <LogOut size={18} />
                <span className="hidden sm:block text-sm">Exit</span>
            </button>
        </nav>
    );
};

export default Navbar;
