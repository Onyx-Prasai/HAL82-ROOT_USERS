import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { TrendingUp, Users, Zap, Briefcase, Microscope, Info, Menu } from 'lucide-react';
import logo from '../../assets/logo.png';
import Sidebar from './Sidebar';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <>
            <nav className="fixed top-4 left-1/2 -translate-x-1/2 bg-surface-card/90 backdrop-blur-md border border-surface-border shadow-lg rounded-full px-3 py-1.5 z-50 flex items-center space-x-2 transition-colors duration-300">
                <NavLink to="/dashboard" className="flex items-center group px-1">
                    <img src={logo} alt="Sangam Logo" className="w-14 h-14 object-contain rounded-full group-hover:scale-105 transition-transform dark:brightness-110" />
                </NavLink>

                <div className="w-[1px] h-6 bg-surface-border mx-1"></div>

                <NavButton to="/dashboard" icon={<TrendingUp size={18} />} label="Uthan" />
                <NavButton to="/matcher" icon={<Users size={18} />} label="Jodi" />
                <NavButton to="/pulse" icon={<Zap size={18} />} label="Pulse" />
                <NavButton to="/syndicate" icon={<Briefcase size={18} />} label="Syndicate" />
                <NavButton to="/marketplace" icon={<Microscope size={18} />} label="Experts" />

                <div className="w-[1px] h-6 bg-surface-border mx-1"></div>

                <NavButton to="/vision" icon={<Info size={18} />} label="Vision" />

                <div className="w-[1px] h-6 bg-surface-border mx-1"></div>

                <NotificationDropdown />

                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="flex items-center justify-center p-2 rounded-full hover:bg-surface-base transition-colors text-surface-text"
                >
                    <Menu size={22} className="stroke-[2.5px]" />
                </button>
            </nav>

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </>
    );
};

const NavButton = ({ to, icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) => `flex items-center space-x-2 px-3 py-1.5 rounded-full font-bold transition-all ${isActive
            ? 'bg-sangam-emerald/10 text-sangam-emerald'
            : 'text-surface-text-muted hover:text-surface-text hover:bg-surface-base'
            }`}
    >
        {icon}
        <span className="hidden sm:block text-sm">{label}</span>
    </NavLink>
);

export default Navbar;
