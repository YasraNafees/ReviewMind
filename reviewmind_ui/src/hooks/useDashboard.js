import { useState } from 'react';
import axios from 'axios';
import { logError, logInfo, logDebug } from '../utils/logger';

const FILE = 'useDashboard.js';
const API = 'http://127.0.0.1:8000';

export function useDashboard() {
  const [activeNav, setActiveNav] = useState('overview');
  const [sentiments, setSentiments] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [summary, setSummary] = useState('');
  const [question, setQuestion] = useState('');
  const [botAnswer, setBotAnswer] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadMsg, setUploadMsg] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [botLoading, setBotLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true); setFetchError('');
    try {
      logDebug(FILE, 'fetch', 'Calling API');
      const res = await axios.get(`${API}/get-dashboard-data/`);
      if (res.data?.sentiments) {
        setSentiments([
          { name: 'Negative', value: res.data.sentiments.Negative || 0 },
          { name: 'Neutral', value: res.data.sentiments.Neutral || 0 },
          { name: 'Positive', value: res.data.sentiments.Positive || 0 },
        ]);
        setClusters(res.data.clusters || []);
      }
    } catch (err) { logError(FILE, 'fetch', 'Failed', err); setFetchError('Backend not reachable. Is FastAPI running?'); }
    finally { setLoading(false); }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploadMsg('Uploading...'); setUploadStatus('');
    const fd = new FormData(); fd.append('file', selectedFile);
    try {
      await axios.post(`${API}/upload-csv/`, fd);
      setUploadMsg('Done! Hit Refresh to see charts.'); setUploadStatus('success');
    } catch (err) { setUploadMsg('Upload failed.'); setUploadStatus('error'); logError(FILE, 'upload', 'Failed', err); }
  };

  const getSummary = async () => {
    setSummaryLoading(true); setSummary('Thinking...');
    try { const res = await axios.post(`${API}/generate-summary/`); setSummary(Object.values(res.data.summaries).join('\n\n')); }
    catch (err) { setSummary('Could not generate summary.'); logError(FILE, 'summary', 'Failed', err); }
    finally { setSummaryLoading(false); }
  };

  const askBot = async () => {
    if (!question) return;
    setBotLoading(true); setBotAnswer('Looking through your reviews...');
    try { const res = await axios.post(`${API}/ask-bot/?question=${encodeURIComponent(question)}`); setBotAnswer(res.data.answer); }
    catch (err) { setBotAnswer('Something went wrong.'); logError(FILE, 'bot', 'Failed', err); }
    finally { setBotLoading(false); }
  };

  const totalReviews = sentiments.reduce((a, c) => a + c.value, 0) || 0;
  const negCount = sentiments.find(s => s.name === 'Negative')?.value || 0;
  const posCount = sentiments.find(s => s.name === 'Positive')?.value || 0;
  const posPct = totalReviews > 0 ? Math.round((posCount / totalReviews) * 100) : 0;
  const negPct = totalReviews > 0 ? Math.round((negCount / totalReviews) * 100) : 0;
  const neuPct = totalReviews > 0 ? 100 - posPct - negPct : 0;
  const sentimentScore = totalReviews > 0 ? Math.round(((posCount - negCount) / totalReviews) * 50 + 50) : 0;
  const maxComplaints = clusters.length > 0 ? Math.max(...clusters.map(c => c.complaints || 0)) : 0;

  return {
    activeNav, sentiments, clusters, summary, question, botAnswer,
    selectedFile, uploadMsg, uploadStatus, loading, fetchError, summaryLoading, botLoading,
    setActiveNav, setQuestion, setSelectedFile,
    fetchDashboardData, handleUpload, getSummary, askBot,
    totalReviews, posPct, negPct, neuPct, sentimentScore, maxComplaints,
  };
}