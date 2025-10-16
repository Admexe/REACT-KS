import React, { useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import {
  AlertCircle, TrendingUp, Code, FileText, AlertTriangle, CheckCircle2,
  ArrowDownRight, ArrowUpRight, Info
} from "lucide-react";

/**
 * RailsMetricsDashboard
 * Unified dashboard with top-level tabs:
 *  - "Before Improvements"
 *  - "After Improvements"
 *
 * Notes about AFTER data sources (from uploaded files):
 * - RuboCop: d2c303d5-2fb7-4d9f-9ff5-6f126168115f.json
 * - Reek:    4be8ff8f-7745-41b8-9794-389eff157d4c.json
 * - Flog:    22283e7a-840e-4280-b70d-a638b941f6b1.txt
 * - Flay:    e8cf06bc-06ba-4b15-b0c5-5f9a763f593e.txt
 * - Coverage:105063f3-c81c-4e5d-824b-4ba4c07c3c91.html
 */

// ---------- Shared UI bits ----------
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#22c55e", "#a855f7"];

const Section = ({ title, extra, children }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-start justify-between mb-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      {extra}
    </div>
    {children}
  </div>
);

const MetricCard = ({ title, value, subtitle, icon: Icon, color, delta, deltaType }) => {
  const DeltaIcon = deltaType === "up" ? ArrowUpRight : ArrowDownRight;
  const deltaColor =
    delta == null
      ? "text-gray-400"
      : deltaType === "down"
      ? "text-emerald-600"
      : "text-rose-600";
  return (
    <div className="bg-white rounded-lg shadow p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold" style={{ color }}>{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          {delta != null && (
            <div className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${deltaColor}`}>
              <DeltaIcon size={14} />
              <span>{delta}</span>
            </div>
          )}
        </div>
        {Icon && <Icon className="text-gray-400" size={24} />}
      </div>
    </div>
  );
};

// ---------- BEFORE DATA (from your original dashboard) ----------
const before = {
  summary: {
    flogTotal: 282.8,
    flogAvg: 6.1,
    rubocopOffenses: 509,
    reekWarnings: 93,
    flayScore: 152,
    coverageOverall: 7.89,
    coverageLinesText: "22 of 279 relevant lines covered",
  },
  flogTop: [
    { name: "StudentsController#show", score: 17.5 },
    { name: "GroupsController#update", score: 15.9 },
    { name: "PagesController#home", score: 15.0 },
    { name: "StudentsController#destroy", score: 14.8 },
    { name: "GradesController#destroy", score: 14.8 },
    { name: "GroupsController#show", score: 13.7 },
    { name: "StudentsController#update_absence", score: 13.2 },
    { name: "PagesController#currentteach", score: 11.5 },
  ],
  rubocopSeverity: [
    { name: "Convention", value: 487, color: "#3b82f6" },
    { name: "Warning", value: 22, color: "#f59e0b" },
  ],
  topRubocopIssues: [
    { issue: "Style/StringLiterals", count: 182 },
    { issue: "Style/FrozenStringLiteralComment", count: 71 },
    { issue: "Style/Documentation", count: 41 },
    { issue: "Layout/EmptyLines", count: 18 },
    { issue: "Style/SymbolArray", count: 15 },
  ],
  reekByType: [
    { category: "IrresponsibleModule", count: 41 },
    { category: "DuplicateMethodCall", count: 15 },
    { category: "InstanceVariableAssumption", count: 8 },
    { category: "TooManyStatements", count: 8 },
    { category: "FeatureEnvy", count: 5 },
    { category: "Other", count: 16 },
  ],
  flay: [
    { type: "Identical Code", score: 108 },
    { type: "Similar Code", score: 44 },
  ],
  coverageByType: [
    { type: "Controllers", coverage: 0.0 },
    { type: "Models", coverage: 69.23 },
    { type: "Helpers", coverage: 100.0 },
    { type: "Mailers", coverage: 0.0 },
    { type: "Channels", coverage: 0.0 },
    { type: "Jobs", coverage: 0.0 },
  ],
  bestPractices: [
    { category: "DB Indexing", count: 3 },
    { category: "Empty Helpers", count: 3 },
    { category: "Unused Methods", count: 2 },
    { category: "Model Logic", count: 1 },
    { category: "Route Restriction", count: 1 },
    { category: "Model Association", count: 1 },
  ],
  overallRadar: [
    { metric: "Code Quality", value: 65 },
    { metric: "Complexity", value: 70 },
    { metric: "Duplication", value: 85 },
    { metric: "Best Practices", value: 75 },
    { metric: "Documentation", value: 40 },
  ],
};

// ---------- AFTER DATA (parsed from your uploaded files) ----------
const after = {
  summary: {
    flogTotal: 281.5,               // flog total (lower is better)  
    flogAvg: 6.1,                   // flog avg                      
    rubocopOffenses: 50,            // total offenses                
    rubocopConvention: 48,          // by severity                   
    rubocopWarning: 2,              // by severity                   
    reekWarnings: 89,               // total smells                  
    flayScore: 128,                 // total duplication             
    coverageOverall: 27.69,         // SimpleCov overall %           
    coverageLinesText: "72 of 260 relevant lines covered", // from HTML summary  
  },
  flogTop: [
    { name: "StudentsController#show", score: 20.2 },              // 
    { name: "GroupsController#update", score: 15.8 },              // 
    { name: "GroupsController#show", score: 15.4 },                // 
    { name: "PagesController#home", score: 15.0 },                 // 
    { name: "StudentsController#destroy", score: 14.8 },           // 
    { name: "StudentsController#update_absence", score: 13.2 },    // 
    { name: "GroupsController#create", score: 11.3 },              // 
    { name: "GradesController#create", score: 11.2 },              // 
    { name: "PagesController#currentteach", score: 10.1 },         // 
    { name: "StudentsController#add_to_group", score: 9.2 },       // 
  ],
  rubocopSeverity: [
    { name: "Convention", value: 48, color: "#3b82f6" }, // 
    { name: "Warning", value: 2, color: "#f59e0b" },     // 
  ],
  topRubocopIssues: [
    { issue: "Style/Documentation", count: 30 },       // 
    { issue: "Metrics/MethodLength", count: 8 },       // 
    { issue: "Layout/LineLength", count: 3 },          // 
    { issue: "Metrics/BlockLength", count: 3 },        // 
    { issue: "Metrics/AbcSize", count: 2 },            // 
  ],
  // Top 5 + "Other" grouped to mirror your previous chart
  reekByType: [
    { category: "IrresponsibleModule", count: 45 },            // 
    { category: "DuplicateMethodCall", count: 13 },            // 
    { category: "InstanceVariableAssumption", count: 8 },      // 
    { category: "TooManyStatements", count: 8 },               // 
    { category: "FeatureEnvy", count: 6 },                     // 
    { category: "Other", count: 9 },                           // (Uncomm. Var Name 6, ControlParameter 1, TooManyInstanceVariables 1, UtilityFunction 1)  
  ],
  flay: [
    { type: "Total Duplication", score: 128 },                 // 
  ],
  coverageByType: [
    { type: "Controllers", coverage: 23.26 },                  // 
    { type: "Models", coverage: 72.0 },                        // 
    { type: "Helpers", coverage: 100.0 },                      // 
    { type: "Mailers", coverage: 0.0 },                        // 
    { type: "Channels", coverage: 0.0 },                       // 
    { type: "Jobs", coverage: 0.0 },                           // 
  ],
  // Improvement radar (normalized deltas vs BEFORE)
  improvementRadar: [
    // Higher is better here, representing %-improvement from BEFORE
    { metric: "RuboCop Improvement", value: Math.round((1 - 50/509) * 1000) / 10 },     // ~90.2%
    { metric: "Duplication Improvement", value: Math.round((1 - 128/152) * 1000) / 10 },// ~15.8%
    { metric: "Coverage %", value: 27.69 },                                              // direct %
    { metric: "Reek Improvement", value: Math.round((1 - 89/93) * 1000) / 10 },         // ~4.3%
    { metric: "Complexity Improvement", value: Math.round((1 - 281.5/282.8) * 1000) / 10 }, // ~0.5%
  ],
   clocData: [
    { language: "JavaScript", code: 11868 },
    { language: "CSS", code: 11054 },
    { language: "Haml", code: 742 },
    { language: "Ruby", code: 297 },
    { language: "ERB", code: 15 },
    { language: "SCSS", code: 6 },
  ],
  clocSummary: {
    totalFiles: 76,
    totalLines: 25348,
    totalCode: 23982,
    frontendRatio: ((11868 + 11054) / 23982 * 100).toFixed(1),
  },
};

// ---------- Utility to switch dataset ----------
const useActiveDataset = (mode) => {
  return mode === "before" ? before : after;
};

const TabsTop = ({ mode, setMode }) => (
  <div className="bg-white rounded-lg shadow mb-6">
    <div className="flex border-b">
      {[
        { key: "before", label: "Before Improvements" },
        { key: "after", label: "After Improvements" },
      ].map((t) => (
        <button
          key={t.key}
          onClick={() => setMode(t.key)}
          className={`px-6 py-3 font-medium ${
            mode === t.key
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  </div>
);

// ---------- Component ----------
const RailsMetricsDashboard = () => {
  // Top-level tab: before/after
  const [mode, setMode] = useState("after"); // default to "after" to showcase improvements
  // Sub-tabs inside each mode
  const [activeTab, setActiveTab] = useState("overview");

  const data = useActiveDataset(mode);

  // deltas used on summary cards (when in "after" mode)
  const deltas = useMemo(() => {
    if (mode !== "after") return {};
    return {
      flog: `${(Math.max(0, before.summary.flogTotal - after.summary.flogTotal)).toFixed(1)} ↓ from ${before.summary.flogTotal}`,
      rubocop: `${((1 - after.summary.rubocopOffenses / before.summary.rubocopOffenses) * 100).toFixed(0)}% fewer`,
      reek: `${((1 - after.summary.reekWarnings / before.summary.reekWarnings) * 100).toFixed(0)}% fewer`,
      flay: `${(before.summary.flayScore - after.summary.flayScore)} ↓ from ${before.summary.flayScore}`,
      coverage: `↑ from ${before.summary.coverageOverall.toFixed(2)}%`,
    };
  }, [mode]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Rails Code Metrics Dashboard
          </h1>
          <p className="text-gray-600">
            Comprehensive analysis from Flog, RuboCop, Reek, Rails Best Practices & Flay
          </p>
        </div>

        {/* Top-level mode tabs */}
        <TabsTop mode={mode} setMode={setMode} />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <MetricCard
            title="Flog Total Score"
            value={data.summary.flogTotal}
            subtitle={`Avg: ${data.summary.flogAvg} per method`}
            icon={TrendingUp}
            color="#3b82f6"
            delta={mode === "after" ? deltas.flog : null}
            deltaType="down"
          />
          <MetricCard
            title="RuboCop Offenses"
            value={data.summary.rubocopOffenses}
            subtitle={mode === "before" ? "71 files inspected" : "↓ massive reduction"}
            icon={AlertCircle}
            color="#f59e0b"
            delta={mode === "after" ? deltas.rubocop : null}
            deltaType="down"
          />
          <MetricCard
            title="Reek Warnings"
            value={data.summary.reekWarnings}
            subtitle="Code smells detected"
            icon={AlertTriangle}
            color="#ef4444"
            delta={mode === "after" ? deltas.reek : null}
            deltaType="down"
          />
          <MetricCard
            title="Flay Duplication"
            value={data.summary.flayScore}
            subtitle="Total score"
            icon={Code}
            color="#10b981"
            delta={mode === "after" ? deltas.flay : null}
            deltaType="down"
          />
          <MetricCard
            title="Overall Coverage"
            value={`${data.summary.coverageOverall.toFixed(2)}%`}
            subtitle={data.summary.coverageLinesText}
            icon={CheckCircle2}
            color="#22c55e"
            delta={mode === "after" ? deltas.coverage : null}
            deltaType="up"
          />
        </div>

        {/* Sub Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
            {["overview", "complexity", "quality", "duplication", "coverage"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium capitalize ${
                  activeTab === tab
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Overall Radar */}
              <Section
                title={mode === "before" ? "Overall Code Health" : "Improvement Signals"}
                extra={
                  mode === "after" ? (
                    <div className="text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded inline-flex items-center gap-1">
                      <Info size={14} />
                      Normalized vs BEFORE (higher is better)
                    </div>
                  ) : null
                }
              >
                <ResponsiveContainer width="100%" height={300}>
                  {mode === "before" ? (
                    <RadarChart data={before.overallRadar}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="Score" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    </RadarChart>
                  ) : (
                    <RadarChart data={after.improvementRadar}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="Improvement" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.55} />
                    </RadarChart>
                  )}
                </ResponsiveContainer>
              </Section>

              {/* RuboCop Severity */}
              <Section title="RuboCop Issues by Severity">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.rubocopSeverity}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.rubocopSeverity.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Section>
            </div>

            {/* Rails Best Practices (only reliable BEFORE; AFTER not provided) */}
            <Section
              title="Rails Best Practices Issues"
              extra={
                mode === "after" ? (
                  <span className="text-xs text-gray-500">
                    No AFTER file provided — showing BEFORE chart for reference
                  </span>
                ) : null
              }
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={before.bestPractices}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </Section>
          </div>
        )}
        {/* Codebase Composition (CLOC) — visible only in AFTER mode */}
{mode === "after" && (
  <Section title="Codebase Composition (CLOC)">
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={after.clocData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="language" />
        <YAxis />
        <Tooltip formatter={(v) => [`${v.toLocaleString()} lines`, "Code"]} />
        <Bar dataKey="code" fill="#10b981">
          {after.clocData.map((entry, index) => (
            <Cell
              key={`cloc-cell-${index}`}
              fill={index < 2 ? "#3b82f6" : "#10b981"} // JS/CSS = blue, others = green
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
    <div className="mt-4 text-sm text-gray-700">
      <p>
        Total <strong>{after.clocSummary.totalFiles}</strong> files,{" "}
        <strong>{after.clocSummary.totalLines.toLocaleString()}</strong> total lines.{" "}
        About <strong>{after.clocSummary.frontendRatio}%</strong> of code is front-end
        (JavaScript + CSS).
      </p>
    </div>
  </Section>
)}


        {activeTab === "complexity" && (
          <div className="space-y-6">
            {/* Flog Scores */}
            <Section title="Top Complex Methods (Flog Scores)">
              <ResponsiveContainer width="100%" height={420}>
                <BarChart data={data.flogTop} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={300} />
                  <Tooltip />
                  <Bar dataKey="score" fill={mode === "after" ? "#10b981" : "#3b82f6"}>
                    {data.flogTop.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.score > 15 ? "#ef4444" : mode === "after" ? "#10b981" : "#3b82f6"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              <div className={`mt-4 p-4 rounded ${mode === "after" ? "bg-emerald-50 text-emerald-900" : "bg-blue-50 text-blue-900"}`}>
                {mode === "after" ? (
                  <p className="text-sm">
                    <strong>Recommendation:</strong> Overall complexity nudged down slightly (281.5 vs 282.8).
                    Focus on refactoring <code className="bg-emerald-100 px-1 rounded">StudentsController#show</code> (20.2)
                    and methods ≥ 15 by extracting smaller pure functions and pushing logic to models/services. 
                  </p>
                ) : (
                  <p className="text-sm">
                    <strong>Recommendation:</strong> Methods with scores above 15 should be refactored to reduce complexity.
                    Consider breaking down large methods into smaller, focused functions.
                  </p>
                )}
              </div>
            </Section>
          </div>
        )}

        {activeTab === "quality" && (
          <div className="space-y-6">
            {/* Reek Warnings */}
            <Section title="Code Smells by Type (Reek)">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data.reekByType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill={mode === "after" ? "#22c55e" : "#8b5cf6"} />
                </BarChart>
              </ResponsiveContainer>
            </Section>

            {/* Top RuboCop Issues */}
            <Section title="Most Common RuboCop Violations">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data.topRubocopIssues} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="issue" type="category" width={260} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>

              {mode === "after" ? (
                <div className="mt-4 p-4 bg-emerald-50 rounded">
                  <p className="text-sm text-emerald-900">
                    <strong>Great progress:</strong> RuboCop offenses down to 50 — primarily{" "}
                    <code className="bg-emerald-100 px-1 rounded">Style/Documentation</code> (30) and some method size metrics.  
                    Add concise class/module docs and trim long methods to push this near zero. 
                  </p>
                </div>
              ) : (
                <div className="mt-4 p-4 bg-amber-50 rounded">
                  <p className="text-sm text-amber-900">
                    <strong>Quick Wins:</strong> Many of these issues are auto-fixable with{" "}
                    <code className="bg-amber-100 px-1 rounded">rubocop -a</code>. Adding frozen string literals and fixing string quotes
                    can resolve 253+ issues.
                  </p>
                </div>
              )}
            </Section>
          </div>
        )}

        {activeTab === "duplication" && (
          <div className="space-y-6">
            {/* Flay Duplication */}
            <Section title="Code Duplication Analysis (Flay)">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mode === "before" ? before.flay : after.flay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={mode === "before" ? "type" : "type"} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill={mode === "after" ? "#10b981" : "#3b82f6"} />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-6 space-y-4">
                {mode === "before" ? (
                  <>
                    <div className="p-4 bg-red-50 rounded">
                      <h4 className="font-semibold text-red-900 mb-2">Identical Code Found (Score: 108)</h4>
                      <p className="text-sm text-red-800">
                        Files: <code className="bg-red-100 px-1 rounded">students/registrations_controller.rb:6</code> and{" "}
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
                  </>
                ) : (
                  <div className="p-4 bg-emerald-50 rounded">
                    <h4 className="font-semibold text-emerald-900 mb-2">Duplication Reduced (Flay total 128)</h4>
                    <p className="text-sm text-emerald-800">
                      Similar code detected in Devise migrations (students/guardians). Consider consolidating shared migration patterns or extracting common helpers to keep duplication low. 
                    </p>
                  </div>
                )}
              </div>
            </Section>
          </div>
        )}

        {activeTab === "coverage" && (
          <div className="space-y-6">
            {/* Overall Coverage */}
            <Section title="Overall Test Coverage">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {data.summary.coverageOverall.toFixed(2)}%
              </div>
              <p className="text-sm text-gray-600">
                {data.summary.coverageLinesText}
              </p>
            </Section>

            {/* Coverage by Type */}
            <Section title="Coverage by Component Type">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.coverageByType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="coverage" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </Section>

            {/* Coverage Recommendations */}
            <Section title={mode === "after" ? "Coverage Recommendations (Next Steps)" : "Coverage Recommendations"}>
              {mode === "after" ? (
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
                  <li>
                    <span className="font-medium">Push controllers past 50%:</span> they’re at{" "}
                    <span className="font-semibold">23.26%</span>. Add request/system specs for
                    <code className="bg-gray-100 mx-1 px-1 rounded">GradesController</code> and
                    <code className="bg-gray-100 mx-1 px-1 rounded">StudentsController</code>. 
                  </li>
                  <li>Maintain 100% coverage in helpers and models — great job keeping these green. </li>
                  <li>Add baseline tests for mailers, channels, and jobs — all currently at 0%. </li>
                </ul>
              ) : (
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
                  <li>Write controller specs — all controllers currently have 0% coverage.</li>
                  <li>Maintain 100% coverage in helpers and models; they’re well tested.</li>
                  <li>Add feature tests for mailers and channels to improve reliability.</li>
                  <li>Use <code className="bg-gray-100 px-1 rounded">rspec --format=documentation</code> for clearer test outputs.</li>
                </ul>
              )}
            </Section>
          </div>
        )}

        {/* Action Items */}
        <Section
          title="Priority Action Items"
          extra={
            mode === "after" ? (
              <div className="text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded inline-flex items-center gap-1">
                <CheckCircle2 size={14} />
                Focused on remaining hotspots
              </div>
            ) : null
          }
        >
          <div className="space-y-3">
            {mode === "after" ? (
              <>
                <div className="flex items-start p-3 bg-emerald-50 rounded">
                  <div className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</div>
                  <div>
                    <p className="font-medium text-emerald-900">Add Documentation Comments</p>
                    <p className="text-sm text-emerald-800">
                      {`30 classes/modules flagged by RuboCop Style/Documentation — add brief class-level docs to wipe these.`} 
                    </p>
                  </div>
                </div>
                <div className="flex items-start p-3 bg-blue-50 rounded">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</div>
                  <div>
                    <p className="font-medium text-blue-900">Increase Controller Coverage</p>
                    <p className="text-sm text-blue-800">
                      Controllers at <strong>23.26%</strong> — add request/system specs for CRUD paths and edge cases. 
                    </p>
                  </div>
                </div>
                <div className="flex items-start p-3 bg-amber-50 rounded">
                  <div className="flex-shrink-0 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</div>
                  <div>
                    <p className="font-medium text-amber-900">Refactor Long Methods</p>
                    <p className="text-sm text-amber-800">
                      Tackle <code className="bg-amber-100 px-1 rounded">StudentsController#show</code> (20.2) and other ≥ 15 flog. 
                    </p>
                  </div>
                </div>
                <div className="flex items-start p-3 bg-purple-50 rounded">
                  <div className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</div>
                  <div>
                    <p className="font-medium text-purple-900">Keep Duplication Down</p>
                    <p className="text-sm text-purple-800">
                      Flay down to 128 — DRY up repeated Devise migration code. 
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </Section>
      </div>
    </div>
  );
};

export default RailsMetricsDashboard;
