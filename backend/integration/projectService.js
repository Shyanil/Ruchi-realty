import { supabase } from './supabase';
import { SEED_PROJECTS, normalizeProject, sortByOrder } from '../data/projects';

const buildPayload = (projectData) => {
  const toOrder = (value) =>
    value === null || value === undefined || value === '' || Number.isNaN(Number(value))
      ? null
      : Number(value);

  return {
    title: projectData.title,
    tag: projectData.tag,
    image_url: projectData.image_url,
    location: projectData.location,
    description: projectData.description || null,
    type: projectData.type,
    status: projectData.status ? projectData.status.trim() : null,
    featured: Boolean(projectData.featured),
    sort_order: toOrder(projectData.sort_order),
    feature_order: toOrder(projectData.feature_order),
  };
};

export const projectService = {
  // DB-only listing for the admin panel (newest first).
  async getAllProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    return { data: (data || []).map(normalizeProject), error };
  },

  // Public listing: built-in seed projects merged with admin-added DB rows,
  // sorted by sort_order. Falls back to the seed projects if the DB read fails
  // so the site always renders.
  async getPublicProjects() {
    const { data, error } = await supabase.from('projects').select('*');
    const bySlug = new Map(SEED_PROJECTS.map(normalizeProject).map((project) => [project.slug, project]));
    (data || []).map(normalizeProject).forEach((project) => {
      if (!bySlug.has(project.slug)) bySlug.set(project.slug, project);
    });
    return { data: sortByOrder([...bySlug.values()], 'sort_order'), error };
  },

  // Looks up a single project (seed or DB) by slug for the detail page.
  async getProjectBySlug(slug) {
    const { data, error } = await this.getPublicProjects();
    const project = (data || []).find((p) => p.slug === slug);
    return {
      data: project || null,
      error: project ? null : error || new Error('Project not found'),
    };
  },

  async createProject(projectData) {
    const { data, error } = await supabase
      .from('projects')
      .insert([buildPayload(projectData)])
      .select();
    return { data: data ? normalizeProject(data[0]) : null, error };
  },

  async updateProject(id, projectData) {
    const { data, error } = await supabase
      .from('projects')
      .update(buildPayload(projectData))
      .eq('id', id)
      .select();
    return { data: data ? normalizeProject(data[0]) : null, error };
  },

  async deleteProject(id) {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    return { error };
  },
};
