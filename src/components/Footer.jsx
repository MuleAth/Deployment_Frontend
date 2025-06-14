import React from 'react';
import { MapPin, Phone, Mail, Globe, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-indigo-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* College Info */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Sinhgad College of Engineering</h3>
            <div className="flex items-start space-x-3">
              <MapPin className="h-4 w-4 md:h-5 md:w-5 mt-1 flex-shrink-0 text-indigo-400" />
              <span className="text-sm md:text-base text-gray-300">Off Sinhgad Road, Vadgaon BK, Pune, 411041</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 md:h-5 md:w-5 text-indigo-400" />
              <span className="text-sm md:text-base text-gray-300">+91 20 2435 7001</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 md:h-5 md:w-5 text-indigo-400" />
              <span className="text-sm md:text-base text-gray-300">sports@sinhgad.edu</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Quick Links</h3>
            <ul className="space-y-1.5 md:space-y-2">
              <li><a href="#" className="text-sm md:text-base text-gray-300 hover:text-white transition duration-300">Home</a></li>
              <li><a href="#events" className="text-sm md:text-base text-gray-300 hover:text-white transition duration-300">Events</a></li>
              <li><a href="#equipment" className="text-sm md:text-base text-gray-300 hover:text-white transition duration-300">Equipment</a></li>
              <li><a href="#achievements" className="text-sm md:text-base text-gray-300 hover:text-white transition duration-300">Achievements</a></li>
              <li><a href="/user/feedback" className="text-sm md:text-base text-gray-300 hover:text-white transition duration-300">Feedback</a></li>
            </ul>
          </div>

          {/* Sports Facilities */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Sports Facilities</h3>
            <ul className="space-y-1.5 md:space-y-2">
              <li className="text-sm md:text-base text-gray-300">Indoor Sports Complex</li>
              <li className="text-sm md:text-base text-gray-300">Olympic Size Swimming Pool</li>
              <li className="text-sm md:text-base text-gray-300">Cricket Ground</li>
              <li className="text-sm md:text-base text-gray-300">Basketball Courts</li>
              <li className="text-sm md:text-base text-gray-300">Fitness Center</li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Connect With Us</h3>
            <div className="flex space-x-3 md:space-x-4 mb-4 md:mb-6">
              <a href="#" className="hover:text-indigo-400 transition duration-300">
                <Facebook className="h-5 w-5 md:h-6 md:w-6" />
              </a>
              <a href="#" className="hover:text-indigo-400 transition duration-300">
                <Twitter className="h-5 w-5 md:h-6 md:w-6" />
              </a>
              <a href="#" className="hover:text-indigo-400 transition duration-300">
                <Instagram className="h-5 w-5 md:h-6 md:w-6" />
              </a>
              <a href="#" className="hover:text-indigo-400 transition duration-300">
                <Linkedin className="h-5 w-5 md:h-6 md:w-6" />
              </a>
            </div>
            <a 
              href="https://cms.sinhgad.edu/sinhgad_engineering_institutes/vadgaon_scoe/about.aspx" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition duration-300"
            >
              <Globe className="h-4 w-4 md:h-5 md:w-5" />
              <span className="text-sm md:text-base">www.sinhgad.edu</span>
            </a>
          </div>
        </div>

        <div className="border-t border-indigo-900 mt-8 md:mt-12 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-xs md:text-sm text-center md:text-left">
              © {new Date().getFullYear()} Sinhgad College of Engineering. All rights reserved.
            </p>
            <div className="flex space-x-4 md:space-x-6">
              <a href="#" className="text-gray-400 hover:text-white text-xs md:text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-xs md:text-sm">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;