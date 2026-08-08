import { apiRequest } from './client'
import type { DashboardData } from './types'

function createResource<T>(path: string, token: string, body: Record<string, unknown>) {
  return apiRequest<T>(path, { method: 'POST', token, body })
}

function updateResource<T>(path: string, token: string, body: Record<string, unknown>) {
  return apiRequest<T>(path, { method: 'PATCH', token, body })
}

function deleteResource(path: string, token: string) {
  return apiRequest<{ success: boolean }>(path, { method: 'DELETE', token })
}

export const adminApi = {
  getDashboard: (token: string) => apiRequest<DashboardData>('/admin/dashboard', { token }),
  getHome: (token: string) => apiRequest<Record<string, unknown>>('/admin/home', { token }),
  updateHome: (token: string, body: Record<string, unknown>) =>
    apiRequest<Record<string, unknown>>('/admin/home', { method: 'PATCH', token, body }),
  getAbout: (token: string) => apiRequest<Record<string, unknown>>('/admin/about', { token }),
  updateAbout: (token: string, body: Record<string, unknown>) =>
    apiRequest<Record<string, unknown>>('/admin/about', { method: 'PATCH', token, body }),
  listExperience: (token: string) => apiRequest<Array<Record<string, unknown>>>('/admin/experience', { token }),
  createExperience: (token: string, body: Record<string, unknown>) =>
    createResource<Record<string, unknown>>('/admin/experience', token, body),
  updateExperience: (token: string, id: string, body: Record<string, unknown>) =>
    updateResource<Record<string, unknown>>(`/admin/experience/${id}`, token, body),
  deleteExperience: (token: string, id: string) => deleteResource(`/admin/experience/${id}`, token),
  listProjects: (token: string) => apiRequest<Array<Record<string, unknown>>>('/admin/projects', { token }),
  createProject: (token: string, body: Record<string, unknown>) =>
    createResource<Record<string, unknown>>('/admin/projects', token, body),
  updateProject: (token: string, id: string, body: Record<string, unknown>) =>
    updateResource<Record<string, unknown>>(`/admin/projects/${id}`, token, body),
  deleteProject: (token: string, id: string) => deleteResource(`/admin/projects/${id}`, token),
  listSkills: (token: string) => apiRequest<Array<Record<string, unknown>>>('/admin/skills', { token }),
  createSkill: (token: string, body: Record<string, unknown>) =>
    createResource<Record<string, unknown>>('/admin/skills', token, body),
  updateSkill: (token: string, id: string, body: Record<string, unknown>) =>
    updateResource<Record<string, unknown>>(`/admin/skills/${id}`, token, body),
  deleteSkill: (token: string, id: string) => deleteResource(`/admin/skills/${id}`, token),
  listPosts: (token: string) => apiRequest<Array<Record<string, unknown>>>('/admin/blog/posts', { token }),
  createPost: (token: string, body: Record<string, unknown>) =>
    createResource<Record<string, unknown>>('/admin/blog/posts', token, body),
  updatePost: (token: string, id: string, body: Record<string, unknown>) =>
    updateResource<Record<string, unknown>>(`/admin/blog/posts/${id}`, token, body),
  deletePost: (token: string, id: string) => deleteResource(`/admin/blog/posts/${id}`, token),
  listCategories: (token: string) => apiRequest<Array<Record<string, unknown>>>('/admin/blog/categories', { token }),
  createCategory: (token: string, body: Record<string, unknown>) =>
    createResource<Record<string, unknown>>('/admin/blog/categories', token, body),
  updateCategory: (token: string, id: string, body: Record<string, unknown>) =>
    updateResource<Record<string, unknown>>(`/admin/blog/categories/${id}`, token, body),
  deleteCategory: (token: string, id: string) => deleteResource(`/admin/blog/categories/${id}`, token),
  listTags: (token: string) => apiRequest<Array<Record<string, unknown>>>('/admin/blog/tags', { token }),
  createTag: (token: string, body: Record<string, unknown>) =>
    createResource<Record<string, unknown>>('/admin/blog/tags', token, body),
  updateTag: (token: string, id: string, body: Record<string, unknown>) =>
    updateResource<Record<string, unknown>>(`/admin/blog/tags/${id}`, token, body),
  deleteTag: (token: string, id: string) => deleteResource(`/admin/blog/tags/${id}`, token),
  listUploads: (token: string) => apiRequest<Array<Record<string, unknown>>>('/admin/uploads', { token }),
  uploadFile: (token: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiRequest<Record<string, unknown>>('/admin/uploads', { method: 'POST', token, body: formData })
  },
  deleteUpload: (token: string, id: string) => deleteResource(`/admin/uploads/${id}`, token),
  getSettings: (token: string) => apiRequest<Record<string, unknown>>('/admin/settings', { token }),
  updateSettings: (token: string, body: Record<string, unknown>) =>
    apiRequest<Record<string, unknown>>('/admin/settings', { method: 'PATCH', token, body }),
}