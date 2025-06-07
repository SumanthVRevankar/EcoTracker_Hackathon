import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Calculator, 
  Users, 
  Trophy, 
  Cloud, 
  TrendingDown, 
  Leaf,
  ArrowRight,
  Globe,
  Zap,
  Recycle
} from 'lucide-react';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Calculator className="h-8 w-8 text-primary-600" />,
      title: "Carbon Calculator",
      description: "Track and calculate your personal carbon footprint with our advanced ML-powered calculator.",
      link: "/calculator"
    },
    {
      icon: <Cloud className="h-8 w-8 text-blue-600" />,
      title: "Weather & Air Quality",
      description: "Monitor real-time weather conditions and air quality index in your area.",
      link: "/weather"
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Community Forum",
      description: "Connect with eco-conscious individuals and share sustainable living tips.",
      link: "/community"
    },
    {
      icon: <Trophy className="h-8 w-8 text-accent-600" />,
      title: "Leaderboard",
      description: "See how your carbon footprint compares with others and get motivated to improve.",
      link: "/leaderboard"
    }
  ];

  const stats = [
    { number: "2.5M+", label: "CO₂ Saved", icon: <TrendingDown className="h-6 w-6" /> },
    { number: "50K+", label: "Active Users", icon: <Users className="h-6 w-6" /> },
    { number: "100+", label: "Cities Covered", icon: <Globe className="h-6 w-6" /> },
    { number: "95%", label: "Accuracy Rate", icon: <Zap className="h-6 w-6" /> }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-800 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm">
                <Leaf className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Track Your
              <span className="block text-accent-300">Carbon Footprint</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Join the movement towards sustainable living. Monitor your environmental impact, 
              connect with like-minded individuals, and make a positive difference for our planet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  to="/calculator"
                  className="px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Calculator className="h-5 w-5" />
                  <span>Start Calculating</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-all duration-300 transform hover:scale-105"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary-100 rounded-xl text-primary-600">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for
              <span className="text-primary-600"> Sustainable Living</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools and community features to help you understand, track, 
              and reduce your environmental impact.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
              >
                <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                <Link
                  to={feature.link}
                  className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors duration-200"
                >
                  Learn More
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm">
              <Recycle className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of users who are already tracking their carbon footprint 
            and making sustainable choices every day.
          </p>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-2"
            >
              <span>Start Your Journey Today</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;