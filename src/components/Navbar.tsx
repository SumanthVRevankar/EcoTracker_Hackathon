import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import NotificationCenter from './NotificationCenter';
import LanguageSelector from './LanguageSelector';
import { 
  Leaf, 
  User, 
  LogOut, 
  Calculator, 
  Users, 
  Trophy, 
  Cloud,
  Menu,
  X,
  Target,
  Brain
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavLink: React.FC<{ to: string; icon: React.ReactNode; children: React.ReactNode }> = ({ to, icon, children }) => (
    <Link
      to={to}
      className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
      onClick={() => setIsMenuOpen(false)}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );

  return (
    <nav className="bg-white shadow-lg border-b border-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-xl">
              <Leaf className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">EcoTracker</h1>
              <p className="text-xs text-gray-500">Carbon & Environment</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <NavLink to="/calculator\" icon={<Calculator className="h-4 w-4" />}>
                  {t('nav.calculator')}
                </NavLink>
                <NavLink to="/weather" icon={<Cloud className="h-4 w-4" />}>
                  {t('nav.weather')}
                </NavLink>
                <NavLink to="/challenges" icon={<Target className="h-4 w-4" />}>
                  {t('nav.challenges')}
                </NavLink>
                <NavLink to="/insights" icon={<Brain className="h-4 w-4" />}>
                  {t('nav.insights')}
                </NavLink>
                <NavLink to="/community" icon={<Users className="h-4 w-4" />}>
                  {t('nav.community')}
                </NavLink>
                <NavLink to="/leaderboard" icon={<Trophy className="h-4 w-4" />}>
                  {t('nav.leaderboard')}
                </NavLink>
                <NavLink to="/profile" icon={<User className="h-4 w-4" />}>
                  {t('nav.profile')}
                </NavLink>
                
                <NotificationCenter />
                <LanguageSelector />
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t('nav.logout')}</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <LanguageSelector />
                <Link
                  to="/login"
                  className="px-4 py-2 text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
                >
                  {t('nav.signin')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium"
                >
                  {t('nav.signup')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated && <NotificationCenter />}
            <LanguageSelector />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {isAuthenticated ? (
              <>
                <NavLink to="/calculator\" icon={<Calculator className="h-4 w-4" />}>
                  {t('nav.calculator')}
                </NavLink>
                <NavLink to="/weather" icon={<Cloud className="h-4 w-4" />}>
                  {t('nav.weather')}
                </NavLink>
                <NavLink to="/challenges" icon={<Target className="h-4 w-4" />}>
                  {t('nav.challenges')}
                </NavLink>
                <NavLink to="/insights" icon={<Brain className="h-4 w-4" />}>
                  {t('nav.insights')}
                </NavLink>
                <NavLink to="/community" icon={<Users className="h-4 w-4" />}>
                  {t('nav.community')}
                </NavLink>
                <NavLink to="/leaderboard" icon={<Trophy className="h-4 w-4" />}>
                  {t('nav.leaderboard')}
                </NavLink>
                <NavLink to="/profile" icon={<User className="h-4 w-4" />}>
                  {t('nav.profile')}
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 w-full"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t('nav.logout')}</span>
                </button>
              </>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="block px-3 py-2 text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.signin')}
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.signup')}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;