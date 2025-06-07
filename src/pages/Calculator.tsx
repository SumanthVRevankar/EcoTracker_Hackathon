import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Calculator as CalcIcon, Leaf, TrendingDown } from 'lucide-react';

interface FormData {
  bodyType: string;
  sex: string;
  diet: string;
  shower: string;
  heatingEnergySource: string;
  transport: string;
  vehicleType: string;
  socialActivity: string;
  groceryBill: number;
  airTravel: string;
  vehicleDistance: number;
  wasteBagSize: string;
  wasteBagCount: number;
  tvPcHours: number;
  newClothes: number;
  internetHours: number;
  energyEfficiency: string;
}

const Calculator: React.FC = () => {
  const { user } = useAuth();
  const { addCarbonRecord } = useData();
  const [formData, setFormData] = useState<FormData>({
    bodyType: '',
    sex: '',
    diet: '',
    shower: '',
    heatingEnergySource: '',
    transport: '',
    vehicleType: '',
    socialActivity: '',
    groceryBill: 0,
    airTravel: '',
    vehicleDistance: 0,
    wasteBagSize: '',
    wasteBagCount: 0,
    tvPcHours: 0,
    newClothes: 0,
    internetHours: 0,
    energyEfficiency: ''
  });
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock carbon footprint calculation
  const calculateCarbonFootprint = (data: FormData): number => {
    let emission = 2.0; // Base emission

    // Diet impact
    if (data.diet === 'meat') emission += 1.5;
    else if (data.diet === 'fish') emission += 0.8;
    else if (data.diet === 'vegetarian') emission += 0.3;
    else if (data.diet === 'vegan') emission -= 0.2;

    // Transport impact
    if (data.transport === 'car') emission += data.vehicleDistance * 0.001;
    else if (data.transport === 'public') emission += 0.3;
    else if (data.transport === 'bike') emission -= 0.2;
    else if (data.transport === 'walk') emission -= 0.3;

    // Energy usage
    emission += data.tvPcHours * 0.05;
    emission += data.internetHours * 0.03;
    emission += data.groceryBill * 0.002;
    emission += data.newClothes * 0.1;

    // Waste impact
    if (data.wasteBagSize === 'small') emission += data.wasteBagCount * 0.1;
    else if (data.wasteBagSize === 'medium') emission += data.wasteBagCount * 0.2;
    else if (data.wasteBagSize === 'large') emission += data.wasteBagCount * 0.3;
    else if (data.wasteBagSize === 'extra large') emission += data.wasteBagCount * 0.4;

    // Air travel impact
    if (data.airTravel === 'very frequently') emission += 2.0;
    else if (data.airTravel === 'frequently') emission += 1.5;
    else if (data.airTravel === 'rarely') emission += 0.5;

    // Energy efficiency bonus
    if (data.energyEfficiency === 'Yes') emission -= 0.3;
    else if (data.energyEfficiency === 'Sometimes') emission -= 0.1;

    return Math.max(0.5, emission); // Minimum 0.5 kg CO2
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const emission = calculateCarbonFootprint(formData);
    setResult(emission);

    if (user) {
      addCarbonRecord(emission, user.id);
    }

    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Bill') || name.includes('Distance') || name.includes('Count') || name.includes('Hours') || name.includes('Clothes')
        ? parseFloat(value) || 0
        : value
    }));
  };

  if (result !== null) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-primary-100 rounded-2xl">
                <Leaf className="h-16 w-16 text-primary-600" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Carbon Footprint</h2>
            
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-6 rounded-xl mb-6">
              <div className="text-4xl font-bold mb-2">{result.toFixed(2)} kg CO₂</div>
              <div className="text-primary-100">per day</div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Monthly Impact</h4>
                <p className="text-2xl font-bold text-blue-700">{(result * 30).toFixed(1)} kg CO₂</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-900 mb-2">Yearly Impact</h4>
                <p className="text-2xl font-bold text-red-700">{(result * 365).toFixed(1)} kg CO₂</p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h4 className="font-semibold text-gray-900 mb-4">Environmental Impact</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>🌱 Trees needed to offset: <strong>{Math.ceil(result * 365 / 21)} trees/year</strong></p>
                <p>🚗 Equivalent to driving: <strong>{(result * 365 / 0.404).toFixed(0)} km/year</strong></p>
                <p>💡 Energy equivalent: <strong>{(result * 365 * 2.3).toFixed(0)} kWh/year</strong></p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Recommendations to Reduce Your Footprint:</h4>
              <div className="grid gap-3 text-sm text-left">
                <div className="flex items-start space-x-2">
                  <TrendingDown className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Consider cycling or walking for short distances</span>
                </div>
                <div className="flex items-start space-x-2">
                  <TrendingDown className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Reduce meat consumption and try plant-based meals</span>
                </div>
                <div className="flex items-start space-x-2">
                  <TrendingDown className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Use energy-efficient appliances and LED lighting</span>
                </div>
                <div className="flex items-start space-x-2">
                  <TrendingDown className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Minimize single-use items and recycle more</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setResult(null);
                setFormData({
                  bodyType: '', sex: '', diet: '', shower: '', heatingEnergySource: '',
                  transport: '', vehicleType: '', socialActivity: '', groceryBill: 0,
                  airTravel: '', vehicleDistance: 0, wasteBagSize: '', wasteBagCount: 0,
                  tvPcHours: 0, newClothes: 0, internetHours: 0, energyEfficiency: ''
                });
              }}
              className="mt-6 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 font-semibold"
            >
              Calculate Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary-100 rounded-xl">
              <CalcIcon className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Carbon Footprint Calculator</h1>
          <p className="text-gray-600">Calculate your daily carbon emissions and environmental impact</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Body Type</label>
                  <select
                    name="bodyType"
                    value={formData.bodyType}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select body type</option>
                    <option value="underweight">Underweight</option>
                    <option value="normal">Normal</option>
                    <option value="overweight">Overweight</option>
                    <option value="obese">Obese</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sex</label>
                  <select
                    name="sex"
                    value={formData.sex}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select sex</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Lifestyle */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Lifestyle & Diet</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Diet</label>
                  <select
                    name="diet"
                    value={formData.diet}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select diet type</option>
                    <option value="meat">Meat lover</option>
                    <option value="fish">Pescatarian</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">How Often Do You Shower?</label>
                  <select
                    name="shower"
                    value={formData.shower}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select frequency</option>
                    <option value="daily">Daily</option>
                    <option value="twice a day">Twice a day</option>
                    <option value="every other day">Every other day</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Grocery Bill ($)</label>
                <input
                  type="number"
                  name="groceryBill"
                  value={formData.groceryBill}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your monthly grocery spending"
                />
              </div>
            </div>

            {/* Transportation */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Transportation</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Transport</label>
                  <select
                    name="transport"
                    value={formData.transport}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select transport method</option>
                    <option value="car">Private car</option>
                    <option value="public">Public transport</option>
                    <option value="bike">Bicycle</option>
                    <option value="walk">Walking</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select vehicle type</option>
                    <option value="petrol">Petrol car</option>
                    <option value="diesel">Diesel car</option>
                    <option value="hybrid">Hybrid car</option>
                    <option value="electric">Electric car</option>
                    <option value="lpg">LPG car</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Monthly Distance (km)</label>
                  <input
                    type="number"
                    name="vehicleDistance"
                    value={formData.vehicleDistance}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter monthly distance"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Air Travel Frequency</label>
                  <select
                    name="airTravel"
                    value={formData.airTravel}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select frequency</option>
                    <option value="never">Never</option>
                    <option value="rarely">Rarely</option>
                    <option value="frequently">Frequently</option>
                    <option value="very frequently">Very frequently</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Home & Energy */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Home & Energy</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Heating Energy Source</label>
                  <select
                    name="heatingEnergySource"
                    value={formData.heatingEnergySource}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select energy source</option>
                    <option value="natural gas">Natural gas</option>
                    <option value="electricity">Electricity</option>
                    <option value="oil">Oil</option>
                    <option value="coal">Coal</option>
                    <option value="wood">Wood</option>
                    <option value="solar">Solar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Energy Efficiency</label>
                  <select
                    name="energyEfficiency"
                    value={formData.energyEfficiency}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Do you prioritize energy efficiency?</option>
                    <option value="No">No</option>
                    <option value="Sometimes">Sometimes</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">TV/PC Daily Hours</label>
                  <input
                    type="number"
                    name="tvPcHours"
                    value={formData.tvPcHours}
                    onChange={handleInputChange}
                    required
                    min="0"
                    max="24"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Hours per day"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Internet Daily Hours</label>
                  <input
                    type="number"
                    name="internetHours"
                    value={formData.internetHours}
                    onChange={handleInputChange}
                    required
                    min="0"
                    max="24"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Hours per day"
                  />
                </div>
              </div>
            </div>

            {/* Consumption & Waste */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Consumption & Waste</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Waste Bag Size</label>
                  <select
                    name="wasteBagSize"
                    value={formData.wasteBagSize}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select bag size</option>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="extra large">Extra Large</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Waste Bags Per Week</label>
                  <input
                    type="number"
                    name="wasteBagCount"
                    value={formData.wasteBagCount}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Number of bags"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Clothes Per Month</label>
                  <input
                    type="number"
                    name="newClothes"
                    value={formData.newClothes}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Number of items"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Social Activity Level</label>
                  <select
                    name="socialActivity"
                    value={formData.socialActivity}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select activity level</option>
                    <option value="never">Never</option>
                    <option value="rarely">Rarely</option>
                    <option value="sometimes">Sometimes</option>
                    <option value="often">Often</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Calculating Your Carbon Footprint...
                  </>
                ) : (
                  <>
                    <CalcIcon className="h-5 w-5 mr-2" />
                    Calculate My Carbon Footprint
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Calculator;