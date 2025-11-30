import React, { useState, useEffect } from 'react';
import {
  Phone,
  Shield,
  AlertCircle,
  MapPin,
  User,
  MessageCircle,
  Home,
  Map,
  Settings,
  ChevronRight,
  Volume2,
  VolumeX,
  Video,
  Send,
  PhoneCall,
  Bell,
  Heart,
  Navigation,
  Clock,
  Check,
  X,
  Plus,
  Trash2,
  AlertTriangle,
  Droplet,
  Plane,
  Building,
  Camera,
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

// Emergency contacts for India
const emergencyContacts = [
  { id: 'police', label: 'Police', number: '100', icon: Shield, color: 'bg-blue-500' },
  { id: 'ambulance', label: 'Ambulance', number: '108', icon: Heart, color: 'bg-red-500' },
  { id: 'women', label: 'Women', number: '1091', icon: User, color: 'bg-pink-500' },
  { id: 'tourist', label: 'Tourist', number: '1363', icon: Plane, color: 'bg-green-500' },
  { id: 'emergency', label: 'Emergency', number: '112', icon: AlertCircle, color: 'bg-orange-500' },
  { id: 'fire', label: 'Fire', number: '101', icon: AlertTriangle, color: 'bg-yellow-500' },
];

// Risk zones data
const riskZones = [
  { id: 1, label: 'Janpath Market', category: 'theft', intensity: 85, note: 'High pickpocket activity' },
  { id: 2, label: 'Old Delhi Station', category: 'theft', intensity: 90, note: 'Watch bags at all times' },
  { id: 3, label: 'Paharganj Area', category: 'harassment', intensity: 65, note: 'Persistent touts' },
  { id: 4, label: 'GB Road Area', category: 'danger', intensity: 95, note: 'Avoid after dark' },
  { id: 5, label: 'Chandni Chowk', category: 'theft', intensity: 75, note: 'Crowded market area' },
];

// SOS Features
const sosFeatures = [
  { id: 'fake-call', title: 'Fake Call', desc: 'Get a fake incoming call', icon: PhoneCall, color: 'bg-blue-100 text-blue-600' },
  { id: 'silent-sos', title: 'Silent SOS', desc: 'Trigger without sound', icon: VolumeX, color: 'bg-red-100 text-red-600' },
  { id: 'siren', title: 'Loud Siren', desc: 'Attract attention', icon: Volume2, color: 'bg-orange-100 text-orange-600' },
  { id: 'record', title: 'Record Evidence', desc: 'Audio/video recording', icon: Video, color: 'bg-purple-100 text-purple-600' },
  { id: 'location', title: 'Share Location', desc: 'Send to contacts', icon: Navigation, color: 'bg-green-100 text-green-600' },
  { id: 'sms', title: 'Emergency SMS', desc: 'Pre-written message', icon: Send, color: 'bg-indigo-100 text-indigo-600' },
];

// Safe spots
const safeSpots = [
  { id: 1, name: 'CP Police Station', type: 'police', distance: '0.5 km', address: 'Connaught Place' },
  { id: 2, name: 'RML Hospital', type: 'hospital', distance: '1.2 km', address: 'Baba Kharak Singh Marg' },
  { id: 3, name: 'Embassy Zone', type: 'embassy', distance: '4.5 km', address: 'Chanakyapuri' },
];

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [sosActive, setSosActive] = useState(false);
  const [sirenActive, setSirenActive] = useState(false);
  const [recordingActive, setRecordingActive] = useState(false);
  const [showFakeCall, setShowFakeCall] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    email: '',
    nationality: '',
    bloodType: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    hotelName: '',
    hotelAddress: '',
    allergies: '',
    medications: '',
    passportNumber: '',
  });
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Hello! I'm your safety concierge. How can I help you stay safe in India today?", sender: 'assistant' },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Calculate profile completion
  const profileFields = [profile.name, profile.phone, profile.emergencyContactName, profile.emergencyContactPhone, profile.bloodType];
  const profileCompletion = Math.round((profileFields.filter(f => f && f.trim()).length / profileFields.length) * 100);

  const handleSOS = () => {
    setSosActive(!sosActive);
    if (!sosActive) {
      // Trigger SOS
      alert('SOS ACTIVATED!\n\nEmergency services are being contacted.\nYour location is being shared.');
    }
  };

  const triggerFakeCall = () => {
    setTimeout(() => setShowFakeCall(true), 3000);
    alert('Fake call scheduled in 3 seconds...');
  };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    const newMsg = { id: Date.now(), text: chatInput, sender: 'user' };
    setChatMessages([...chatMessages, newMsg]);
    setChatInput('');
    
    // Simulate response
    setTimeout(() => {
      const responses = [
        "For your safety, I recommend using only verified transport apps like Uber or Ola.",
        "Emergency numbers: 112 (Universal), 100 (Police), 108 (Ambulance), 1091 (Women)",
        "Stay in well-lit areas at night. Avoid isolated streets after 10pm.",
        "Keep your valuables secure. Use hotel safe for passport and extra cash.",
      ];
      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'assistant'
      }]);
    }, 1000);
  };

  const renderHome = () => (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm">Welcome back</p>
          <h1 className="text-2xl font-bold text-gray-900">{profile.name || 'Traveler'}</h1>
        </div>
        <button 
          onClick={() => setActiveTab('profile')}
          className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-600"
        >
          {profile.name ? (
            <span className="text-blue-600 font-bold text-lg">{profile.name.charAt(0).toUpperCase()}</span>
          ) : (
            <User className="w-6 h-6 text-blue-600" />
          )}
        </button>
      </div>

      {/* Profile Alert */}
      {profileCompletion < 100 && (
        <button 
          onClick={() => setActiveTab('profile')}
          className="w-full bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-amber-500" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-gray-900 text-sm">Complete your safety profile</p>
            <p className="text-gray-500 text-xs">{profileCompletion}% complete • Add emergency contacts</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      )}

      {/* Main SOS Card */}
      <button 
        onClick={() => setActiveTab('emergency')}
        className={`w-full rounded-2xl p-5 text-white ${sosActive ? 'gradient-emergency' : 'gradient-primary'}`}
      >
        <div className="flex justify-between items-center">
          <div className="text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full mb-2">
              <div className={`w-2 h-2 rounded-full ${sosActive ? 'bg-white animate-pulse' : 'bg-green-400'}`} />
              <span className="text-xs font-semibold">{sosActive ? 'SOS ACTIVE' : 'Protection Ready'}</span>
            </div>
            <h2 className="text-xl font-bold">{sosActive ? 'Emergency Active' : 'Emergency Hub'}</h2>
            <p className="text-white/80 text-sm mt-1">Fake call • Silent SOS • Siren • Recording</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <AlertCircle className="w-10 h-10" />
          </div>
        </div>
        <div className="flex gap-2 mt-4 flex-wrap">
          {['24/7 monitoring', 'Escort dispatch', 'Live location'].map(feature => (
            <span key={feature} className="bg-white/10 px-3 py-1 rounded-full text-xs">{feature}</span>
          ))}
        </div>
      </button>

      {/* Quick Emergency Calls */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-3">Quick Emergency Calls</h3>
        <div className="grid grid-cols-4 gap-2">
          {emergencyContacts.slice(0, 4).map(contact => (
            <a 
              key={contact.id} 
              href={`tel:${contact.number}`}
              className="flex flex-col items-center gap-1 p-2 bg-red-50 rounded-xl border border-red-100"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                <contact.icon className="w-5 h-5 text-red-500" />
              </div>
              <span className="text-xs text-gray-600">{contact.label}</span>
              <span className="font-bold text-red-600">{contact.number}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Emergency Hub', desc: 'All SOS features', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50', tab: 'emergency', border: 'border-red-200' },
            { label: 'Safety Map', desc: 'View risk zones', icon: Map, color: 'text-blue-500', bg: 'bg-blue-50', tab: 'map', border: 'border-transparent' },
            { label: 'Get Help', desc: 'Chat support', icon: MessageCircle, color: 'text-teal-500', bg: 'bg-teal-50', tab: 'help', border: 'border-transparent' },
            { label: 'My Profile', desc: 'Safety info', icon: User, color: 'text-purple-500', bg: 'bg-purple-50', tab: 'profile', border: 'border-transparent' },
          ].map(action => (
            <button
              key={action.label}
              onClick={() => setActiveTab(action.tab)}
              className={`bg-white p-4 rounded-xl shadow-sm text-left border ${action.border}`}
            >
              <div className={`w-11 h-11 rounded-full ${action.bg} flex items-center justify-center mb-2`}>
                <action.icon className={`w-6 h-6 ${action.color}`} />
              </div>
              <p className="font-bold text-gray-900">{action.label}</p>
              <p className="text-gray-500 text-xs">{action.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-3 rounded-xl shadow-sm text-center">
          <div className="w-10 h-10 mx-auto rounded-full bg-teal-50 flex items-center justify-center mb-1">
            <Clock className="w-5 h-5 text-teal-500" />
          </div>
          <p className="font-bold text-gray-900">28°C</p>
          <p className="text-xs text-gray-500">Sunny</p>
        </div>
        <div className="bg-white p-3 rounded-xl shadow-sm text-center">
          <div className="w-10 h-10 mx-auto rounded-full bg-amber-50 flex items-center justify-center mb-1">
            <Shield className="w-5 h-5 text-amber-500" />
          </div>
          <p className="font-bold text-gray-900">64/100</p>
          <p className="text-xs text-gray-500">City Risk</p>
        </div>
        <div className="bg-white p-3 rounded-xl shadow-sm text-center">
          <div className="w-10 h-10 mx-auto rounded-full bg-indigo-50 flex items-center justify-center mb-1">
            <User className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="font-bold text-gray-900">3</p>
          <p className="text-xs text-gray-500">Watchers</p>
        </div>
      </div>
    </div>
  );

  const renderEmergency = () => (
    <div className="space-y-4 pb-20">
      {/* Main SOS Button */}
      <div className={`rounded-2xl p-6 ${sosActive ? 'gradient-emergency' : 'gradient-primary'}`}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
            <div className={`w-2 h-2 rounded-full ${sosActive ? 'bg-white animate-pulse' : 'bg-green-400'}`} />
            <span className="text-white text-xs font-semibold">{sosActive ? 'SOS ACTIVE' : 'System Ready'}</span>
          </div>
          {recordingActive && (
            <div className="flex items-center gap-1 bg-red-500 px-2 py-1 rounded-full">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-white text-xs font-bold">REC</span>
            </div>
          )}
        </div>
        
        <button 
          onClick={handleSOS}
          className="w-40 h-40 mx-auto rounded-full bg-white shadow-xl flex flex-col items-center justify-center"
        >
          {sosActive ? (
            <X className="w-16 h-16 text-red-500" />
          ) : (
            <AlertCircle className="w-16 h-16 text-blue-600" />
          )}
          <span className={`font-extrabold text-xl mt-1 ${sosActive ? 'text-red-500' : 'text-blue-600'}`}>
            {sosActive ? 'DEACTIVATE' : 'SOS'}
          </span>
        </button>
        
        <p className="text-white/80 text-center text-sm mt-4">
          {sosActive 
            ? 'Tap to deactivate and notify contacts you are safe'
            : 'Tap for emergency. Calls 112 + shares location.'}
        </p>
        
        {sosActive && (
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs text-white flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Location sharing
            </span>
            {recordingActive && (
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs text-white flex items-center gap-1">
                <Video className="w-3 h-3" /> Recording
              </span>
            )}
          </div>
        )}
      </div>

      {/* Emergency Numbers */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-3">Emergency Numbers (India)</h3>
        <div className="grid grid-cols-3 gap-2">
          {emergencyContacts.map(contact => (
            <a 
              key={contact.id} 
              href={`tel:${contact.number}`}
              className="flex flex-col items-center gap-1 p-3 bg-red-50 rounded-xl border border-red-100"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                <contact.icon className="w-5 h-5 text-red-500" />
              </div>
              <span className="text-xs text-gray-600">{contact.label}</span>
              <span className="font-bold text-red-600">{contact.number}</span>
            </a>
          ))}
        </div>
      </div>

      {/* SOS Features */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-3">Safety Tools</h3>
        <div className="grid grid-cols-2 gap-3">
          {sosFeatures.map(feature => (
            <button
              key={feature.id}
              onClick={() => {
                if (feature.id === 'fake-call') triggerFakeCall();
                else if (feature.id === 'siren') setSirenActive(!sirenActive);
                else if (feature.id === 'record') setRecordingActive(!recordingActive);
                else if (feature.id === 'silent-sos') { setSosActive(true); }
                else alert(`${feature.title} activated!`);
              }}
              className={`p-3 rounded-xl text-left ${feature.color.split(' ')[0]}`}
            >
              <div className={`w-10 h-10 rounded-full ${feature.color.includes('blue') ? 'bg-blue-600' : feature.color.includes('red') ? 'bg-red-600' : feature.color.includes('orange') ? 'bg-orange-500' : feature.color.includes('purple') ? 'bg-purple-600' : feature.color.includes('green') ? 'bg-green-600' : 'bg-indigo-600'} flex items-center justify-center mb-2`}>
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <p className="font-bold text-gray-900 text-sm">{feature.title}</p>
              <p className="text-gray-500 text-xs">{feature.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Safe Spots */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-3">Nearby Safe Locations</h3>
        {safeSpots.map(spot => (
          <div key={spot.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-2">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              spot.type === 'police' ? 'bg-blue-500' : spot.type === 'hospital' ? 'bg-red-500' : 'bg-green-500'
            }`}>
              {spot.type === 'police' ? <Shield className="w-6 h-6 text-white" /> :
               spot.type === 'hospital' ? <Heart className="w-6 h-6 text-white" /> :
               <Building className="w-6 h-6 text-white" />}
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900">{spot.name}</p>
              <p className="text-gray-500 text-sm">{spot.address}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-sm">{spot.distance}</p>
              <button className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <Navigation className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMap = () => (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Safety Map</h1>
          <p className="text-gray-500 text-sm">Live risk zones • India</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-green-600 text-xs font-semibold">Live</span>
        </div>
      </div>

      {/* City Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['Delhi NCR', 'Mumbai', 'Jaipur', 'Agra'].map(city => (
          <button 
            key={city}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap ${
              city === 'Delhi NCR' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span className="font-semibold text-sm">{city}</span>
          </button>
        ))}
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'all', label: 'All Zones', color: 'bg-gray-800' },
          { id: 'theft', label: 'Theft', color: 'bg-red-500' },
          { id: 'harassment', label: 'Harassment', color: 'bg-amber-500' },
          { id: 'danger', label: 'Danger', color: 'bg-purple-600' },
        ].map(cat => (
          <button 
            key={cat.id}
            className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap ${
              cat.id === 'all' ? `${cat.color} text-white` : 'bg-white border border-gray-200 text-gray-700'
            }`}
          >
            <div className={`w-3 h-3 rounded-full ${cat.color}`} />
            <span className="font-semibold text-sm">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Map Placeholder */}
      <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl h-64 flex flex-col items-center justify-center shadow-lg">
        <Map className="w-12 h-12 text-blue-500 mb-3" />
        <h3 className="text-xl font-bold text-gray-900">Interactive Safety Map</h3>
        <p className="text-gray-500 text-sm mb-4">Full map on mobile app</p>
        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm text-center">
            <p className="text-2xl font-bold text-gray-900">{riskZones.length}</p>
            <p className="text-xs text-gray-500">Risk Zones</p>
          </div>
          <div className="bg-red-50 px-4 py-2 rounded-xl shadow-sm text-center">
            <p className="text-2xl font-bold text-red-600">{riskZones.filter(z => z.intensity >= 75).length}</p>
            <p className="text-xs text-gray-500">Critical</p>
          </div>
          <div className="bg-amber-50 px-4 py-2 rounded-xl shadow-sm text-center">
            <p className="text-2xl font-bold text-amber-600">{riskZones.filter(z => z.intensity >= 50 && z.intensity < 75).length}</p>
            <p className="text-xs text-gray-500">High Risk</p>
          </div>
        </div>
      </div>

      {/* Risk Zone List */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-3">Active Risk Zones</h3>
        {riskZones.map(zone => (
          <div key={zone.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-2">
            <div className={`w-11 h-11 rounded-full flex items-center justify-center ${
              zone.category === 'theft' ? 'bg-red-100' : zone.category === 'harassment' ? 'bg-amber-100' : 'bg-purple-100'
            }`}>
              <AlertTriangle className={`w-5 h-5 ${
                zone.category === 'theft' ? 'text-red-600' : zone.category === 'harassment' ? 'text-amber-600' : 'text-purple-600'
              }`} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{zone.label}</p>
              <p className="text-gray-500 text-sm">{zone.note}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-400">Updated 2 min ago</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  zone.category === 'theft' ? 'bg-red-100 text-red-600' : 
                  zone.category === 'harassment' ? 'bg-amber-100 text-amber-600' : 'bg-purple-100 text-purple-600'
                }`}>{zone.category}</span>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-lg font-bold ${zone.intensity >= 75 ? 'text-red-600' : zone.intensity >= 50 ? 'text-amber-600' : 'text-green-600'}`}>
                {zone.intensity}%
              </p>
              <p className="text-xs text-gray-500">
                {zone.intensity >= 75 ? 'Critical' : zone.intensity >= 50 ? 'High' : 'Moderate'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Safety Tips */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-3">Stay Safe</h3>
        <div className="space-y-3">
          {[
            'Stay aware of your surroundings in marked zones',
            'Travel in groups during evening hours',
            'Keep valuables secure and out of sight',
            'Save emergency numbers: 100 (Police), 112 (Emergency)',
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-blue-500 mt-0.5" />
              <p className="text-gray-600 text-sm">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHelp = () => (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="gradient-primary p-4 rounded-b-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Safety Concierge</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-white/80 text-sm">Online • 24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4">
        <p className="font-bold text-gray-900 mb-2">Quick Help</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Emergency Numbers', icon: Phone },
            { label: 'Find Safe Place', icon: MapPin },
            { label: 'Safe Transport', icon: Navigation },
            { label: 'Medical Help', icon: Heart },
          ].map(action => (
            <button 
              key={action.label}
              onClick={() => {
                setChatInput(action.label);
                setTimeout(() => sendChatMessage(), 100);
              }}
              className="bg-white p-3 rounded-xl shadow-sm flex flex-col items-center gap-2"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <action.icon className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700 text-center">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatMessages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                <Shield className="w-4 h-4 text-blue-600" />
              </div>
            )}
            <div className={`max-w-[75%] p-3 rounded-xl ${
              msg.sender === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white shadow-sm rounded-tl-none'
            }`}>
              <p className={msg.sender === 'user' ? 'text-white' : 'text-gray-700'}>{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
            placeholder="Type your message..."
            className="flex-1 bg-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={sendChatMessage}
            disabled={!chatInput.trim()}
            className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center disabled:bg-gray-300"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="gradient-primary p-6 rounded-b-2xl -mx-4 -mt-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/40">
              {profile.name ? (
                <span className="text-3xl font-bold text-white">{profile.name.charAt(0).toUpperCase()}</span>
              ) : (
                <User className="w-10 h-10 text-white" />
              )}
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center border-2 border-white">
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{profile.name || 'Set Your Name'}</h2>
            <p className="text-white/80">Tourist in India</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4 bg-white/10 rounded-xl p-3">
          <div className="flex justify-between mb-2">
            <span className="text-white/90 text-sm font-semibold">Profile Completion</span>
            <span className="text-white font-bold">{profileCompletion}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${profileCompletion < 50 ? 'bg-amber-400' : profileCompletion < 100 ? 'bg-blue-400' : 'bg-green-400'}`}
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
        </div>
      </div>

      {/* Alert */}
      {profileCompletion < 100 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <p className="font-bold text-gray-900">Complete Your Safety Profile</p>
            <p className="text-gray-500 text-sm">This information helps authorities and your family in emergencies.</p>
          </div>
        </div>
      )}

      {/* Essential Info */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-red-600" />
          </div>
          <h3 className="font-bold text-gray-900">Essential Information</h3>
          <span className="ml-auto text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold">Critical</span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              Full Name <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded">Required</span>
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              placeholder="As per passport"
              className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              Phone Number <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded">Required</span>
            </label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
              placeholder="+1 xxx-xxx-xxxx"
              className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">Nationality</label>
            <input
              type="text"
              value={profile.nationality}
              onChange={(e) => setProfile({...profile, nationality: e.target.value})}
              placeholder="e.g., United States"
              className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-red-500">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-bold text-gray-900">Emergency Contact</h3>
        </div>
        <div className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-semibold mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4" />
          CRITICAL: This contact will be notified during SOS
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              Contact Name <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded">Required</span>
            </label>
            <input
              type="text"
              value={profile.emergencyContactName}
              onChange={(e) => setProfile({...profile, emergencyContactName: e.target.value})}
              placeholder="Family member or friend"
              className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              Contact Phone <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded">Required</span>
            </label>
            <input
              type="tel"
              value={profile.emergencyContactPhone}
              onChange={(e) => setProfile({...profile, emergencyContactPhone: e.target.value})}
              placeholder="+1 xxx-xxx-xxxx"
              className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Medical Info */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
            <Heart className="w-4 h-4 text-red-600" />
          </div>
          <h3 className="font-bold text-gray-900">Medical Information</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              Blood Type <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded">Required</span>
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                <button
                  key={type}
                  onClick={() => setProfile({...profile, bloodType: type})}
                  className={`px-4 py-2 rounded-full border ${
                    profile.bloodType === type ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">Allergies</label>
            <input
              type="text"
              value={profile.allergies}
              onChange={(e) => setProfile({...profile, allergies: e.target.value})}
              placeholder="Food, medicine, or other allergies"
              className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">Current Medications</label>
            <input
              type="text"
              value={profile.medications}
              onChange={(e) => setProfile({...profile, medications: e.target.value})}
              placeholder="List any medications"
              className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Stay Details */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <Building className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="font-bold text-gray-900">Current Stay in India</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700">Hotel/Accommodation Name</label>
            <input
              type="text"
              value={profile.hotelName}
              onChange={(e) => setProfile({...profile, hotelName: e.target.value})}
              placeholder="Where are you staying?"
              className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">Address</label>
            <input
              type="text"
              value={profile.hotelAddress}
              onChange={(e) => setProfile({...profile, hotelAddress: e.target.value})}
              placeholder="Full address"
              className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Travel Documents */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <Plane className="w-4 h-4 text-green-600" />
          </div>
          <h3 className="font-bold text-gray-900">Travel Documents</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700">Passport Number</label>
            <input
              type="text"
              value={profile.passportNumber}
              onChange={(e) => setProfile({...profile, passportNumber: e.target.value})}
              placeholder="Your passport number"
              className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fake Call Modal */}
      {showFakeCall && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center mb-6">
            <User className="w-14 h-14 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Mom</h2>
          <p className="text-white/70 text-lg mb-12">Incoming call...</p>
          <div className="flex gap-16">
            <button 
              onClick={() => setShowFakeCall(false)}
              className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center"
            >
              <X className="w-8 h-8 text-white" />
            </button>
            <button 
              onClick={() => { setShowFakeCall(false); alert('Call connected! Pretend to talk.'); }}
              className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center"
            >
              <Phone className="w-8 h-8 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-md mx-auto p-4">
        {activeTab === 'home' && renderHome()}
        {activeTab === 'map' && renderMap()}
        {activeTab === 'emergency' && renderEmergency()}
        {activeTab === 'help' && renderHelp()}
        {activeTab === 'profile' && renderProfile()}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg safe-area-bottom">
        <div className="max-w-md mx-auto flex justify-around py-2">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'map', icon: Map, label: 'Map' },
            { id: 'emergency', icon: AlertCircle, label: 'SOS', special: true },
            { id: 'help', icon: MessageCircle, label: 'Help' },
            { id: 'profile', icon: User, label: 'Profile' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 ${
                tab.special ? '-mt-6' : ''
              }`}
            >
              {tab.special ? (
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${
                  sosActive ? 'bg-red-600' : 'bg-red-500'
                }`}>
                  <tab.icon className="w-7 h-7 text-white" />
                </div>
              ) : (
                <tab.icon className={`w-6 h-6 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'}`} />
              )}
              <span className={`text-xs font-medium ${
                tab.special 
                  ? (sosActive ? 'text-red-600' : 'text-red-500')
                  : (activeTab === tab.id ? 'text-blue-600' : 'text-gray-400')
              }`}>
                {tab.special ? (sosActive ? 'ACTIVE' : 'SOS') : tab.label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default App;
