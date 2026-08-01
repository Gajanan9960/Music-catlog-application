import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer } from 'recharts';

const COLORS = ['#fa243c', '#007aff', '#ff9500', '#34c759', '#af52de', '#ff2d55', '#5856d6'];

export default function Analytics() {
  const [data, setData] = useState(null);
  const [insight, setInsight] = useState(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/library/analytics')
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const fetchInsight = async () => {
    setLoadingInsight(true);
    try {
      const res = await api.get('/library/insight');
      setInsight(res.data.insight);
    } catch (e) {
      console.error(e);
      setInsight("Failed to generate insight.");
    } finally {
      setLoadingInsight(false);
    }
  };

  if (loading) return <div>Loading dashboard...</div>;

  const hasData = data && Object.keys(data.genreCounts).length > 0;

  if (!hasData) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--text-secondary)' }}>
        <h2>No data available</h2>
        <p>Save some albums to view your analytics.</p>
      </div>
    );
  }

  // Formatting for Recharts
  const pieData = Object.entries(data.genreCounts).map(([name, value]) => ({ name, value }));
  const lineData = Object.entries(data.releaseYearCounts).map(([name, value]) => ({ name, value })).sort((a,b) => a.name.localeCompare(b.name));
  const histData = Object.entries(data.trackCountBuckets).map(([name, value]) => ({ name, value }));
  const barData = Object.entries(data.topArtists).map(([name, value]) => ({ name, value }));

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Your Taste Dashboard</h2>

      <div className="insight-panel">
        <h3 style={{ marginBottom: '10px' }}>AI Trend Summary</h3>
        {insight ? (
          <p>{insight} <button onClick={fetchInsight} style={{ marginLeft: '10px', fontSize: '0.8rem', padding: '4px 8px' }}>Regenerate</button></p>
        ) : (
          <button onClick={fetchInsight} disabled={loadingInsight}>
            {loadingInsight ? 'Generating...' : 'Get my taste summary'}
          </button>
        )}
      </div>

      <div className="dashboard-grid">
        <div className="chart-panel">
          <h3>Genre Breakdown</h3>
          <div style={{ height: 300, width: '100%' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#8884d8" paddingAngle={5} dataKey="value" label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Most of your library is {pieData.sort((a,b)=>b.value-a.value)[0]?.name}</p>
        </div>

        <div className="chart-panel">
          <h3>Releases by Year</h3>
          <div style={{ height: 300, width: '100%' }}>
            <ResponsiveContainer>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="var(--accent-color)" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>You save albums mostly from {lineData.sort((a,b)=>b.value-a.value)[0]?.name || 'various years'}</p>
        </div>

        <div className="chart-panel">
          <h3>Track Count Distribution</h3>
          <div style={{ height: 300, width: '100%' }}>
            <ResponsiveContainer>
              <BarChart data={histData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#007aff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>You prefer albums with {histData.sort((a,b)=>b.value-a.value)[0]?.name || '?'} tracks</p>
        </div>

        <div className="chart-panel">
          <h3>Top Artists</h3>
          <div style={{ height: 300, width: '100%' }}>
            <ResponsiveContainer>
              <BarChart data={barData} layout="vertical" margin={{ left: 50 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="value" fill="#af52de" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Your top artist is {barData.sort((a,b)=>b.value-a.value)[0]?.name || 'Unknown'}</p>
        </div>
      </div>
    </div>
  );
}
