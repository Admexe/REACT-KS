import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { AlertCircle, TrendingUp, Code, FileText, AlertTriangle } from 'lucide-react';

const RailsMetricsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Flog data - complexity scores
  const flogData = [
    { name: 'StudentsController#show', score: 17.5 },
    { name: 'GroupsController#update', score: 15.9 },
    { name: 'PagesController#home', score: 15.0 },
    { name: 'StudentsController#destroy', score: 14.8 },
    { name: 'GradesController#destroy', score: 14.8 },
    { name: 'GroupsController#show', score: 13.7 },
    { name: 'StudentsController#update_absence', score: 13.2 },
    { name: 'PagesController#currentteach', score: 11.5 }
  ];

  // Rails Best Practices issues by type
  const bestPracticesData = [
    { category: 'DB Indexing', count: 3 },
    { category: 'Empty Helpers', count: 3 },
    { category: 'Unused Methods', count: 2 },
    { category: 'Model Logic', count: 1 },
    { category: 'Route Restriction', count: 1 },
    { category: 'Model Association', count: 1 }
  ];

  // Reek warnings by category
  const reekData = [
    { category: 'IrresponsibleModule', count: 41 },
    { category: 'DuplicateMethodCall', count: 15 },
    { category: 'InstanceVariableAssumption', count: 8 },
    { category: 'TooManyStatements', count: 8 },
    { category: 'FeatureEnvy', count: 5 },
    { category: 'Other', count: 16 }
  ];

  // RuboCop offenses by severity
  const rubocopSeverity = [
    { name: 'Convention', value: 487, color: '#3b82f6' },
    { name: 'Warning', value: 22, color: '#f59e0b' }
  ];

  // Top RuboCop issues
  const topRubocopIssues = [
    { issue: 'Style/StringLiterals', count: 182 },
    { issue: 'Style/FrozenStringLiteralComment', count: 71 },
    { issue: 'Style/Documentation', count: 41 },
    { issue: 'Layout/EmptyLines', count: 18 },
    { issue: 'Style/SymbolArray', count: 15 }
  ];

  // Flay duplication
  const flayData = [
    { type: 'Identical Code', score: 108 },
    { type: 'Similar Code', score: 44 }
  ];

  // Overall metrics radar
  const overallMetrics = [
    { metric: 'Code Quality', value: 65 },
    { metric: 'Complexity', value: 70 },
    { metric: 'Duplication', value: 85 },
    { metric: 'Best Practices', value: 75 },
    { metric: 'Documentation', value: 40 }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const MetricCard = ({ title, value, subtitle, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold" style={{ color }}>{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <Icon className="text-gray-400" size={24} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Rails Code Metrics Dashboard</h1>
          <p className="text-gray-600">Comprehensive analysis from Flog, RuboCop, Reek, Rails Best Practices & Flay</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Flog Total Score"
            value="282.8"
            subtitle="Avg: 6.1 per method"
            icon={TrendingUp}
            color="#3b82f6"
          />
          <MetricCard
            title="RuboCop Offenses"
            value="509"
            subtitle="71 files inspected"
            icon={AlertCircle}
            color="#f59e0b"
          />
          <MetricCard
            title="Reek Warnings"
            value="93"
            subtitle="Code smells detected"
            icon={AlertTriangle}
            color="#ef4444"
          />
          <MetricCard
            title="Flay Duplication"
            value="152"
            subtitle="Total score"
            icon={Code}
            color="#10b981"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
            {['overview', 'complexity', 'quality', 'duplication', 'coverage'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium capitalize ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Overall Quality Radar */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Overall Code Health</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={overallMetrics}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Score" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* RuboCop Severity */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">RuboCop Issues by Severity</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={rubocopSeverity}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {rubocopSeverity.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Rails Best Practices */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Rails Best Practices Issues</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bestPracticesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'complexity' && (
          <div className="space-y-6">
            {/* Flog Scores */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Top Complex Methods (Flog Scores)</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={flogData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={250} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#3b82f6">
                    {flogData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.score > 15 ? '#ef4444' : '#3b82f6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-blue-50 rounded">
                <p className="text-sm text-blue-900">
                  <strong>Recommendation:</strong> Methods with scores above 15 should be refactored to reduce complexity.
                  Consider breaking down large methods into smaller, focused functions.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quality' && (
          <div className="space-y-6">
            {/* Reek Warnings */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Code Smells by Type (Reek)</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={reekData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top RuboCop Issues */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Most Common RuboCop Violations</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={topRubocopIssues} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="issue" type="category" width={220} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-amber-50 rounded">
                <p className="text-sm text-amber-900">
                  <strong>Quick Wins:</strong> Many of these issues are auto-fixable with <code className="bg-amber-100 px-1 rounded">rubocop -a</code>.
                  Adding frozen string literals and fixing string quotes can resolve 253+ issues.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'duplication' && (
          <div className="space-y-6">
            {/* Flay Duplication */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Code Duplication Analysis (Flay)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={flayData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-6 space-y-4">
                <div className="p-4 bg-red-50 rounded">
                  <h4 className="font-semibold text-red-900 mb-2">Identical Code Found (Score: 108)</h4>
                  <p className="text-sm text-red-800">
                    Files: <code className="bg-red-100 px-1 rounded">students/registrations_controller.rb:6</code> and{' '}
                    <code className="bg-red-100 px-1 rounded">teachers/registrations_controller.rb:6</code>
                  </p>
                  <p className="text-sm text-red-800 mt-2">
                    <strong>Action:</strong> Extract common registration logic into a shared concern or base class.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded">
                  <h4 className="font-semibold text-yellow-900 mb-2">Similar Code Found (Score: 44)</h4>
                  <p className="text-sm text-yellow-800">
                    Files: Invitation mailer views (HTML and text templates)
                  </p>
                  <p className="text-sm text-yellow-800 mt-2">
                    <strong>Action:</strong> Consider using partials or a single template with conditional rendering.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'coverage' && (
  <div className="space-y-6">
    {/* Overall Coverage */}
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Overall Test Coverage</h3>
      <div className="text-4xl font-bold text-blue-600 mb-2">7.89%</div>
      <p className="text-sm text-gray-600">22 of 279 relevant lines covered</p>
    </div>

    {/* Coverage by Type */}
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Coverage by Component Type</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={[
          { type: 'Controllers', coverage: 0.0 },
          { type: 'Models', coverage: 69.23 },
          { type: 'Helpers', coverage: 100.0 },
          { type: 'Mailers', coverage: 0.0 },
          { type: 'Channels', coverage: 0.0 },
          { type: 'Jobs', coverage: 0.0 },
        ]}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="type" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Bar dataKey="coverage" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* Coverage Recommendations */}
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Coverage Recommendations</h3>
      <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
        <li>Write controller specs — all controllers currently have 0% coverage.</li>
        <li>Maintain 100% coverage in helpers and models; they’re well tested.</li>
        <li>Add feature tests for mailers and channels to improve reliability.</li>
        <li>Use <code className="bg-gray-100 px-1 rounded">rspec --format=documentation</code> for clearer test outputs.</li>
      </ul>
    </div>
  </div>
)}

        {/* Action Items */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FileText className="mr-2" size={20} />
            Priority Action Items
          </h3>
          <div className="space-y-3">
            <div className="flex items-start p-3 bg-red-50 rounded">
              <div className="flex-shrink-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</div>
              <div>
                <p className="font-medium text-red-900">Add Database Indexes</p>
                <p className="text-sm text-red-800">Missing indexes on grades (student_id, group_id) and students (invited_by_id, invited_by_type)</p>
              </div>
            </div>
            <div className="flex items-start p-3 bg-orange-50 rounded">
              <div className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</div>
              <div>
                <p className="font-medium text-orange-900">Refactor Complex Methods</p>
                <p className="text-sm text-orange-800">8 methods have complexity scores above 11 - break these into smaller functions</p>
              </div>
            </div>
            <div className="flex items-start p-3 bg-yellow-50 rounded">
              <div className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</div>
              <div>
                <p className="font-medium text-yellow-900">Add Documentation</p>
                <p className="text-sm text-yellow-800">41 classes/modules lack descriptive comments - add class-level documentation</p>
              </div>
            </div>
            <div className="flex items-start p-3 bg-blue-50 rounded">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</div>
              <div>
                <p className="font-medium text-blue-900">Remove Code Duplication</p>
                <p className="text-sm text-blue-800">Extract shared registration logic from students/teachers controllers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RailsMetricsDashboard;