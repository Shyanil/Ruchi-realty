import { useState, useEffect, useCallback } from 'react';
import { leadService } from '../services/leadService';

export function useLeads({ autoFetch = true } = {}) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await leadService.getAllLeads();
      if (fetchErr) throw fetchErr;
      setLeads(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, []);

  const submitLead = async (leadData) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: submitErr } = await leadService.submitLead(leadData);
      if (submitErr) throw submitErr;
      return { success: true, data };
    } catch (err) {
      setError(err.message || 'Failed to submit lead');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: updateErr } = await leadService.updateLeadStatus(id, status);
      if (updateErr) throw updateErr;
      setLeads((prev) => prev.map((l) => (l.id === id ? data : l)));
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to update status');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const deleteLead = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const { error: deleteErr } = await leadService.deleteLead(id);
      if (deleteErr) throw deleteErr;
      setLeads((prev) => prev.filter((l) => l.id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to delete lead');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchLeads();
    }
  }, [autoFetch, fetchLeads]);

  return {
    leads,
    loading,
    error,
    refresh: fetchLeads,
    submitLead,
    updateStatus,
    deleteLead,
  };
}
