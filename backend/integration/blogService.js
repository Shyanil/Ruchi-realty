import { supabase } from './supabase';

const createSlug = (title) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const BLOG_CATEGORY_OPTIONS = ['News', 'Buying Guide', 'Market Trends', 'Investment'];

const estimateReadTime = (content = '') => {
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 180));
  return `${minutes} min read`;
};

export const normalizeBlog = (blog) => {
  if (!blog) return blog;
  const tags = Array.isArray(blog.tags) ? blog.tags : [];

  return {
    ...blog,
    tags,
    featured: Boolean(blog.featured),
    category: blog.category || tags[0] || BLOG_CATEGORY_OPTIONS[0],
    read: blog.read || estimateReadTime(blog.content),
  };
};

export const blogService = {
  async getAllBlogs() {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('published_at', { ascending: false });
    return { data: data?.map(normalizeBlog) || [], error };
  },

  async getBlogBySlug(slug) {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    return { data: normalizeBlog(data), error };
  },

  async createBlog(blogData) {
    const payload = {
      slug: createSlug(blogData.title),
      published_at: new Date().toISOString(),
      ...blogData,
    };

    const { data, error } = await supabase
      .from('blogs')
      .insert([payload])
      .select();
    return { data: data ? data[0] : null, error };
  },

  async updateBlog(id, blogData) {
    const { data, error } = await supabase
      .from('blogs')
      .update(blogData)
      .eq('id', id)
      .select();
    return { data: data ? data[0] : null, error };
  },

  async updateFeatured(id, featured) {
    return this.updateBlog(id, { featured });
  },

  async deleteBlog(id) {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);
    return { error };
  },

  async getApprovedComments(blogId) {
    if (!blogId) return { data: [], error: null };

    const { data, error } = await supabase
      .from('blog_comments')
      .select('id, name, comment, created_at')
      .eq('blog_id', blogId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    return { data: data || [], error };
  },

  async createComment(blogId, commentData) {
    if (!blogId) {
      return { data: null, error: new Error('Blog ID is required') };
    }

    const payload = {
      blog_id: blogId,
      name: commentData.name,
      email: commentData.email,
      comment: commentData.comment,
      status: 'pending',
    };

    const { error } = await supabase
      .from('blog_comments')
      .insert([payload]);

    return { data: null, error };
  },

  async getAllComments() {
    const { data, error } = await supabase
      .from('blog_comments')
      .select('id, blog_id, created_at, name, email, comment, status, admin_notes, blogs(title, slug)')
      .order('created_at', { ascending: false });

    return { data: data || [], error };
  },

  async updateCommentStatus(id, status) {
    const { data, error } = await supabase
      .from('blog_comments')
      .update({ status })
      .eq('id', id)
      .select()
      .maybeSingle();

    return { data, error };
  },

  async deleteComment(id) {
    const { error } = await supabase
      .from('blog_comments')
      .delete()
      .eq('id', id);

    return { error };
  },
};
