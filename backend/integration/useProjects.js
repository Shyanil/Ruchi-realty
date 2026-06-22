import { useState, useEffect, useCallback } from 'react';
import { projectService } from '../services/projectService';

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await projectService.getAllProjects();
      if (fetchErr) throw fetchErr;
      setProjects(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, []);

  const getProject = useCallback(async (slug) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await projectService.getProjectBySlug(slug);
      if (fetchErr) throw fetchErr;
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch project details');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = async (projectData) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: saveErr } = await projectService.createProject(projectData);
      if (saveErr) throw saveErr;
      setProjects((prev) => [...prev, data]);
      return { success: true, data };
    } catch (err) {
      setError(err.message || 'Failed to create project');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, updateProject = async (id, projectData) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: updateErr } = await projectService.updateProject(id, projectData);
      if (updateErr) throw updateErr;
      setProjects((prev) => prev.map((p) => (p.id === id ? data : p)));
      return { success: true, data };
    } catch (err) {
      setError(err.message || 'Failed to update project');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, deleteProject = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const { error: deleteErr } = await projectService.deleteProject(id);
      if (deleteErr) throw deleteErr;
      setProjects((prev) => prev.filter((p) => p.id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to delete project');
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    refresh: fetchProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
  };
}
