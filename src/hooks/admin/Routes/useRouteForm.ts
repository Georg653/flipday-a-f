import { formFields, externalMedia } from '../../../features/JsonImport/schema';
import type { Data } from '../../../features/JsonImport/schema';
import { toRequestError } from '../../../utils/errors';
// --- Путь: src/hooks/admin/Routes/useRouteForm.ts ---
// ПОЛНАЯ ВЕРСИЯ

import { useState, useEffect } from 'react';
import type { 
  Route, 
  RouteFormData, 
  RouteCreateUpdatePayload 
} from '../../../types/admin/Routes/route.types';
import type { PointBase } from '../../../types/admin/Points/point.types';
import type { RouteCategory } from '../../../types/admin/RouteCategories/routeCategory.types';

import { RoutesApi } from '../../../services/admin/Routes/routesApi';
import { PointsApi } from '../../../services/admin/Points/pointsApi';
import { RouteCategoriesApi } from '../../../services/admin/RouteCategories/routeCategoriesApi';
import { createImageUrl } from '../../../utils/media';

const initialFormData: RouteFormData = {
  name: '',
  description: '',
  route_category_id: '',
  distance: '0',
  estimated_time: '0',
  budget: '0',
  image_file: null,
  image_preview_url: null,
  remove_image: false,
  points: [],
};

interface UseRouteFormOptions {
  routeToEdit: Route | null;
  onSuccess: () => void;
}

export const useRouteForm = ({ routeToEdit, onSuccess }: UseRouteFormOptions) => {
  const [formData, setFormData] = useState<RouteFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [allCategories, setAllCategories] = useState<RouteCategory[]>([]);
  const [allPoints, setAllPoints] = useState<PointBase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDataForForm = async () => {
      setIsLoading(true);
      setFormError(null);
      try {
        const [categoriesData, pointsData] = await Promise.all([
          RouteCategoriesApi.getRouteCategories({ limit: 1000 }),
          PointsApi.getPoints({ limit: 1000 })
        ]);
        setAllCategories(categoriesData);
        setAllPoints(pointsData);
      } catch {
        setFormError('Ошибка загрузки данных для формы (категорий или точек).');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDataForForm();
  }, []);

  useEffect(() => {
    if (routeToEdit) {
      setFormData({
        name: routeToEdit.name,
        description: routeToEdit.description,
        route_category_id: String(routeToEdit.route_category_id),
        distance: String(routeToEdit.distance),
        estimated_time: String(routeToEdit.estimated_time),
        budget: String(routeToEdit.budget),
        image_file: null,
        image_preview_url: routeToEdit.image,
        remove_image: false,
        points: routeToEdit.points,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [routeToEdit]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, image_file: file, image_preview_url: file ? URL.createObjectURL(file) : null, remove_image: false }));
  };
  const handleRemoveImage = (checked: boolean) => {
    setFormData(prev => ({ ...prev, remove_image: checked, image_file: null, image_preview_url: checked ? null : createImageUrl(routeToEdit?.image) }));
  };
  const handlePointsChange = (newPoints: PointBase[]) => {
    setFormData(prev => ({ ...prev, points: newPoints }));
  };

  const applyFromJson = (data: Data) => {
    const fields=formFields('routes',data);
    if (Array.isArray(data.points)) {
      const selected=data.points.map(id=>allPoints.find(point=>point.id===id));
      if(selected.some(point=>!point))throw new Error('Одна из точек не найдена. Дождитесь загрузки списка и проверьте ID.');
      fields.points=selected;
    }
    if(data.route_category_id!==undefined&&!allCategories.some(category=>category.id===data.route_category_id))throw new Error('Категория не найдена: проверьте ID.');
    setFormData(previous=>({...previous,...fields}));setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    const categoryId = parseInt(formData.route_category_id, 10);
    if (isNaN(categoryId) || categoryId <= 0) {
      setFormError('Нужно выбрать категорию.'); setIsSubmitting(false); return;
    }
    if (formData.points.length === 0) {
      setFormError('Маршрут должен содержать хотя бы одну точку.'); setIsSubmitting(false); return;
    }

    const payload: RouteCreateUpdatePayload = {
      name: formData.name,
      description: formData.description,
      route_category_id: categoryId,
      distance: parseFloat(formData.distance) || 0,
      estimated_time: parseInt(formData.estimated_time, 10) || 0,
      budget: parseFloat(formData.budget) || 0,
      points: formData.points.map(p => p.id),
      image_url: formData.image_file || formData.remove_image ? undefined : externalMedia(formData.image_preview_url),
    };

    try {
      if (routeToEdit) {
        await RoutesApi.updateRoute(routeToEdit.id, payload, formData.image_file, formData.remove_image);
      } else {
        await RoutesApi.createRoute(payload, formData.image_file);
      }
      onSuccess();
    } catch (cause: unknown) {
      const err = toRequestError(cause);
      const detail = err.response?.data?.detail;
      setFormError(typeof detail === 'object' ? JSON.stringify(detail) : detail || 'Ошибка сохранения маршрута');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { applyFromJson,
    formData, isSubmitting, formError, allCategories, allPoints,
    isLoading, handleChange, handleFileChange, handleRemoveImage,
    handlePointsChange, handleSubmit,
  };
};