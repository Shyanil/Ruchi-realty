import { supabase } from './supabase';

const isMockEnabled = () => {
  return false;
};

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

const MOCK_BLOGS = [
  {
    id: '1',
    title: 'Top 5 Real Estate Investment Hotspots in Gwalior (2026)',
    slug: 'top-real-estate-investment-hotspots-gwalior',
    excerpt: 'Discover the fastest-growing locations in Gwalior with highest appreciation potential for land plots and residential units.',
    content: 'Real estate in Gwalior is booming. Driven by infrastructure developments, proximity to the expressway, and industrial hubs, regions like Airport Road and Sitholi are experiencing rapid growth. This article analyzes the five key growth corridors in Gwalior, studying public investments, connectivity upgrades, and market rates.',
    author: 'Amit Sharma',
    published_at: '2026-05-10T10:00:00Z',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
    tags: ['Investment', 'Gwalior Properties', 'Plots']
  },
  {
    id: '2',
    title: 'Guide to Gated Communities: Why Safety and Amenities Matter',
    slug: 'guide-to-gated-communities-safety-amenities',
    excerpt: 'Investing in a residential villa? Learn why luxury gated communities offer higher returns and better security.',
    content: 'When looking for your dream home, safety and community facilities are paramount. Premium Ruchi Realty developments combine elegant homes with comprehensive security configurations. In this post, we discuss the financial and security benefits of investing in gated communities.',
    author: 'Pooja Mishra',
    published_at: '2026-06-01T12:00:00Z',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
    tags: ['Villas', 'Lifestyle', 'Gated Community']
  }
];

const getLocalBlogs = () => {
  const blogs = localStorage.getItem('madhavam_blogs');
  if (!blogs) {
    localStorage.setItem('madhavam_blogs', JSON.stringify(MOCK_BLOGS));
    return MOCK_BLOGS;
  }
  return JSON.parse(blogs);
};

const saveLocalBlogs = (blogs) => {
  localStorage.setItem('madhavam_blogs', JSON.stringify(blogs));
};

export const blogService = {
  async getAllBlogs() {
    if (isMockEnabled()) {
      return { data: getLocalBlogs(), error: null };
    }

    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('published_at', { ascending: false });
    return { data: data?.map(normalizeBlog) || [], error };
  },

  async getBlogBySlug(slug) {
    if (isMockEnabled()) {
      const blog = getLocalBlogs().find((b) => b.slug === slug);
      return { data: blog || null, error: blog ? null : new Error('Blog not found') };
    }

    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    return { data: normalizeBlog(data), error };
  },

  async createBlog(blogData) {
    if (isMockEnabled()) {
      const blogs = getLocalBlogs();
      const newBlog = {
        id: crypto.randomUUID(),
        slug: blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        published_at: new Date().toISOString(),
        ...blogData,
      };
      blogs.push(newBlog);
      saveLocalBlogs(blogs);
      return { data: newBlog, error: null };
    }

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
    if (isMockEnabled()) {
      const blogs = getLocalBlogs();
      const index = blogs.findIndex((b) => b.id === id);
      if (index !== -1) {
        blogs[index] = { ...blogs[index], ...blogData };
        saveLocalBlogs(blogs);
        return { data: blogs[index], error: null };
      }
      return { data: null, error: new Error('Blog not found') };
    }

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
    if (isMockEnabled()) {
      let blogs = getLocalBlogs();
      blogs = blogs.filter((b) => b.id !== id);
      saveLocalBlogs(blogs);
      return { error: null };
    }

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
